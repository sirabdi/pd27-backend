import { Delete } from '@nestjs/common';
import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user-request';
import { UsersService } from './users.service';
import { UpdateUserRequest } from './dto/update-user-request';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async createUser(@Body() request: CreateUserRequest) {
    return await this.userService.createUser(request);
  }

  @Get()
  async getUsers() {
    return await this.userService.getUsers();
  }

  @Put(':userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() request: UpdateUserRequest,
  ) {
    return await this.userService.updateUser(userId, request);
  }

  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string) {
    return await this.userService.deleteUser(userId);
  }

  @Patch('update-profile/:userId')
  async updateProfileImage(
    @Param('userId') userId: string,
    @Body() request: Partial<CreateUserRequest>,
  ) {
    return await this.userService.updateProfileImage(userId, request);
  }
}
