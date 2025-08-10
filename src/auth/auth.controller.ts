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
}
