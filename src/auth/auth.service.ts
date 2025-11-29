import ms from 'ms';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'generated/prisma';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { TokenPayload } from './token-payload.interface';
import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomBytes } from 'crypto';
import { sendMail } from 'src/utils/mail';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async login(user: Users, response: Response) {
    const expires = new Date();
    expires.setMilliseconds(
      expires.getMilliseconds() +
        ms(this.configService.getOrThrow('JWT_EXPIRATION')),
    );

    const tokenPayload: TokenPayload = {
      userId: user.id,
    };

    const accessToken = this.jwtService.sign(tokenPayload);

    // Use consistent payload structure
    const refreshTokenPayload = { userId: user.id };
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn: '7d',
      secret: process.env.JWT_REFRESH_SECRET,
    });

    response.cookie('Authentication', accessToken, {
      secure: true,
      httpOnly: true,
      expires,
    });

    // Use upsert to handle multiple logins
    await this.prismaService.refreshToken.upsert({
      where: { user_id: user.id },
      update: { token: refreshToken },
      create: { user_id: user.id, token: refreshToken },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: expires.toISOString(),
    };
  }

  async verifyEmail(email: string, password: string) {
    try {
      const user = await this.userService.getDatailUser({ email });

      // Check if user is verified/active
      if (user && user.is_verified === false) {
        throw new UnauthorizedException('Credentials are not valid!');
      }

      const authenticated = await bcrypt.compare(password, user.password);

      if (!authenticated) {
        throw new UnauthorizedException();
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Credentials are not valid!');
    }
  }

  async verifyAccount(verification_code: string) {
    const user = await this.userService.getVerifyEmail({ verification_code });
    if (
      user &&
      user.verification_code === verification_code &&
      user.verification_code_expires &&
      user.verification_code_expires > new Date()
    ) {
      await this.userService.verifyEmail(verification_code);
      await this.prismaService.usersVerification.delete({
        where: { id: user.id },
      });
      return { message: 'Account verified!' };
    }
    throw new UnprocessableEntityException('Invalid or expired code');
  }

  async resendVerifyAccount(email: string) {
    let user;
    try {
      user = await this.userService.getDatailUser({ email });
    } catch (error) {
      throw new UnprocessableEntityException('Email not found');
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    await this.prismaService.usersVerification.update({
      where: { user_id: user.id },
      data: {
        verification_code: verificationCode,
        verification_code_expires: new Date(
          Date.now() +
            ms(this.configService.getOrThrow('VERIFICATION_CODE_EXPIRATION')),
        ),
      },
    });

    // Send Email with Mailtrap
    await sendMail({
      to: user.email,
      subject: 'Your Verification Code',
      text: `Your verification code is: ${verificationCode}`,
      html: `<p>Your verification code is: <b>${verificationCode}</b></p>`,
    });

    return { message: 'Verification code resend successfully!' };
  }

  async forgotPassword(email: string) {
    const user = await this.userService.getDatailUser({ email });
    if (!user) {
      throw new UnprocessableEntityException('Email not found');
    }

    // // Generate token and expiry
    const resetToken = randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + ms('15m')); // 15 minutes
    console.log('user ', user);

    // Save to user
    await this.prismaService.resetPasswordToken.create({
      data: {
        user_id: user.id,
        reset_password_token: resetToken,
        reset_password_expires: resetExpires,
      },
    });

    // // Send Email with Mailtrap
    const resetUrl = `https://your-frontend.com/reset-password?token=${resetToken}`;

    await sendMail({
      to: user.email,
      subject: 'Reset your password',
      text: `Reset your password using this link: ${resetUrl}`,
      html: `<p>Reset your password using this link: <a href="${resetUrl}">${resetUrl}</a></p>`,
    });

    return { message: 'Reset password email sent!' };
  }

  async resetPassword(
    token: string,
    newPassword: string,
    confirmationNewPassword: string,
  ) {
    if (newPassword != confirmationNewPassword) {
      throw new UnprocessableEntityException(
        'Password and Confirmation Password does not match!',
      );
    }

    // Find user by token and check expiry
    const user = await this.prismaService.resetPasswordToken.findFirst({
      where: {
        reset_password_token: token,
        reset_password_expires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new UnprocessableEntityException('Invalid or expired token');
    }

    // Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.prismaService.users.update({
      where: { id: user.user_id },
      data: {
        password: hashed,
      },
    });

    // Clear and reset field
    await this.prismaService.resetPasswordToken.delete({
      where: { user_id: user.user_id },
    });

    return { message: 'Password reset successful!' };
  }

  async refreshToken(refreshToken: string, response: Response) {
    const userToken = await this.prismaService.refreshToken.findFirst({
      where: { token: refreshToken },
    });
    if (!userToken) throw new UnauthorizedException('Invalid refresh token');

    // Check if refresh token is expired
    try {
      this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Refresh token expired');
      }
      throw new UnauthorizedException('Invalid refresh token');
    }

    const expires = new Date();
    expires.setMilliseconds(
      expires.getMilliseconds() +
        ms(this.configService.getOrThrow('JWT_EXPIRATION')),
    );

    const tokenPayload: TokenPayload = {
      userId: userToken.user_id,
    };

    const token = this.jwtService.sign(tokenPayload);

    const user = await this.prismaService.users.findUnique({
      where: { id: userToken.user_id },
    });

    const payload = { sub: userToken.user_id, email: user?.email };
    const newRefreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_REFRESH_SECRET,
    });

    response.cookie('Authentication', token, {
      secure: true,
      httpOnly: true,
      expires,
    });

    // Save refresh token to DB
    await this.prismaService.refreshToken.update({
      where: { user_id: userToken.user_id },
      data: { token: newRefreshToken },
    });

    return { tokenPayload, newRefreshToken };
  }

  async logout(user: TokenPayload, response: Response) {
    await this.prismaService.refreshToken.delete({
      where: { user_id: user.userId },
    });

    // Clear the authentication cookie
    response.clearCookie('Authentication', {
      httpOnly: true,
      secure: true,
    });

    return { message: 'Logged out successfully' };
  }
}
