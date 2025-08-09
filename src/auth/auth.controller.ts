import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Controller, Post, Res, UseGuards } from '@nestjs/common';

import type { Response } from 'express';
import type { users } from 'generated/prisma';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @CurrentUser() user: users,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(user, response);
  }
}
