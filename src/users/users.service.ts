import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user-request';
import { UpdateUserRequest } from './dto/update-user-request';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'generated/prisma';
import * as bcrypt from 'bcrypt';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Create user
   * @param userId string
   * @param data Partial<CreateUserRequest>
   */
  async createUser(data: CreateUserRequest) {
    try {
      return await this.prismaService.users.create({
        data: {
          ...data,
          password: await bcrypt.hash(data.password, 10),
          profile_picture: '',
        },
        select: {
          id: true,
          name: true,
          email: true,
          nik: true,
          address: true,
          phone: true,
        },
      });
    } catch (err) {
      if (err.code === 'P2002') {
        if (err.meta && Array.isArray(err.meta.target)) {
          if (err.meta.target.includes('email')) {
            throw new UnprocessableEntityException('Email already exists!');
          }
          if (err.meta.target.includes('nik')) {
            throw new UnprocessableEntityException('NIK already exists!');
          }
          if (err.meta.target.includes('phone')) {
            throw new UnprocessableEntityException('Phone already exists!');
          }
          if (err.meta.target.includes('address')) {
            throw new UnprocessableEntityException('Address already exists!');
          }
        }
        throw new UnprocessableEntityException('Unique constraint failed!');
      }
      throw new UnprocessableEntityException(
        err.message || 'Error creating user',
      );
    }
  }

  /**
   * Get a list of users with optional pagination, search, address filter, and sorting.
   * @param params Optional object:
   *   - skip: number (pagination offset)
   *   - take: number (pagination limit)
   *   - search: string (search by name, case-insensitive)
   *   - address: string (filter by address, exact match)
   *   - orderBy: { field: 'createdDate' | 'name', direction: 'asc' | 'desc' } (sorting)
   * @returns Array of users matching the criteria
   */
  async getUsers(params?: {
    skip?: number;
    take?: number;
    search?: string;
    address?: string;
    orderBy?: { field: 'createdDate' | 'name'; direction: 'asc' | 'desc' };
  }) {
    const { skip, take, search, address, orderBy } = params || {};
    const where: any = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (address) {
      where.address = address;
    }
    const order: any = {};
    if (orderBy) {
      order[orderBy.field] = orderBy.direction;
    }
    return this.prismaService.users.findMany({
      where,
      skip,
      take,
      orderBy: orderBy ? order : undefined,
    });
  }

  /**
   * Update user by userId
   * @param userId string
   * @param data Partial<UpdateUserRequest>
   */
  async updateUser(userId: string, data: UpdateUserRequest) {
    try {
      return await this.prismaService.users.update({
        where: { id: userId },
        data,
        select: {
          id: true,
          name: true,
          email: true,
          nik: true,
          address: true,
          phone: true,
        },
      });
    } catch (err) {
      if (err.code === 'P2025') {
        throw new UnprocessableEntityException('User not found!');
      }
      if (err.code === 'P2002') {
        if (err.meta && Array.isArray(err.meta.target)) {
          if (err.meta.target.includes('email')) {
            throw new UnprocessableEntityException('Email already exists!');
          }
          if (err.meta.target.includes('nik')) {
            throw new UnprocessableEntityException('NIK already exists!');
          }
          if (err.meta.target.includes('phone')) {
            throw new UnprocessableEntityException('Phone already exists!');
          }
          if (err.meta.target.includes('address')) {
            throw new UnprocessableEntityException('Address already exists!');
          }
        }
        throw new UnprocessableEntityException('Unique constraint failed!');
      }
      throw new UnprocessableEntityException(
        err.message || 'Error updating user',
      );
    }
  }

  /**
   * Delete user by userId
   * @param userId string
   */
  async deleteUser(userId: string) {
    try {
      await this.prismaService.users.delete({
        where: { id: userId },
      });
      return 'Delete User Success!';
    } catch (err) {
      if (err.code === 'P2025') {
        throw new UnprocessableEntityException('User not found!');
      }
      throw new UnprocessableEntityException(
        err.message || 'Error deleting user',
      );
    }
  }

  /**
   * Update user profile image by userId
   * @param data Partial<CreateUserRequest>
   */
  async updateProfileImage(userId: string, data: Partial<CreateUserRequest>) {
    try {
      if (!data.profile_picture) {
        throw new UnprocessableEntityException('No profile picture provided');
      }

      // Get current user to find old profile picture
      const user = await this.prismaService.users.findUnique({
        where: { id: userId },
        select: { profile_picture: true },
      });

      const uploadDir = path.join(__dirname, '../../uploads');

      // Remove old image if it exists and is not empty
      if (user?.profile_picture) {
        const oldImagePath = path.join(uploadDir, user.profile_picture);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Save new image
      const base64String = data.profile_picture;
      const filename = `profile_${Date.now()}.png`;
      const uploadPath = path.join(uploadDir, filename);

      // Ensure uploads directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Decode base64 and save file
      const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
      fs.writeFileSync(uploadPath, Buffer.from(base64Data, 'base64'));

      return await this.prismaService.users.update({
        where: { id: userId },
        data: {
          profile_picture: filename,
        },
      });
    } catch (err) {
      if (err.code === 'P2025') {
        throw new UnprocessableEntityException('User not found!');
      }
      throw new UnprocessableEntityException(
        err.message || 'Error updating profile image',
      );
    }
  }

  /**
   * Filter user by email
   * @returns Object of users matching the criteria
   */
  async getEmailUser(filter: Prisma.usersWhereUniqueInput) {
    return this.prismaService.users.findUniqueOrThrow({
      where: filter,
    });
  }
}
