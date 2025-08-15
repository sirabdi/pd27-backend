import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';

import type { Response } from 'express';
import type { Users } from 'generated/prisma';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @CurrentUser() user: Users,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(user, response);
  }

  @Post('verify-account')
  verifyEmail(@Body('verification_code') verification_code: string) {
    return this.authService.verifyAccount(verification_code);
  }

  @Post('resend-verify-account')
  resendVerifyEmail(@Body('email') email: string) {
    return this.authService.resendVerifyAccount(email);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('new_password') newPassword: string,
    @Body('confirmation_new_password') confirmationNewPassword: string,
  ) {
    return this.authService.resetPassword(
      token,
      newPassword,
      confirmationNewPassword,
    );
  }
}
