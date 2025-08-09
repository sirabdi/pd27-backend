import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(username: string, password: string) {
    return this.authService.verifyUser(username, password);
  }
}
