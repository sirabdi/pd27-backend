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

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
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

    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, {
      secure: true,
      httpOnly: true,
      expires,
    });

    return { tokenPayload };
  }

  async verifyEmail(email: string, password: string) {
    try {
      const user = await this.userService.getEmailUser({ email });
      const verification = await this.userService.getVerifyEmail({
        user_id: user.id,
      });

      // Check if user is verified/active
      if (verification && verification.is_verified === false) {
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
      return { message: 'Account verified!' };
    }
    throw new UnprocessableEntityException('Invalid or expired code');
  }
}
