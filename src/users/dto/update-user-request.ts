// src/users/dto/update-user-request.ts
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserRequest } from './create-user-request';

export class UpdateUserRequest extends PartialType(
  OmitType(CreateUserRequest, ['password', 'profile_picture'] as const),
) {}
