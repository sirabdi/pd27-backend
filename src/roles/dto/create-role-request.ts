import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleRequest {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  name: string;
}
