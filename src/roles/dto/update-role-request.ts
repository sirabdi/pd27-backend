// src/users/dto/update-user-request.ts
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateRoleRequest } from './create-role-request';

export class UpdateRoleRequest extends PartialType(
  OmitType(CreateRoleRequest, ['name'] as const),
) {}
