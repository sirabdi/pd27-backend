import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUsers(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNum = parseInt(page || '1');
    const limitNum = parseInt(limit || '10');
    const skip = (pageNum - 1) * limitNum;

    return await this.rolesService.getRoles({
      skip,
      take: limitNum,
      page: pageNum,
    });
  }
}
