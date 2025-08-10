import { IsBoolean, IsString, IsOptional } from 'class-validator';

export class verifyEmailRequest {
  @IsOptional()
  @IsString()
  verification_code: string | null;

  @IsOptional()
  @IsString()
  verification_code_expires: string | null;

  @IsOptional()
  @IsBoolean()
  is_verified: boolean | null;
}
