import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  /**
   * Get a list of roles with optional pagination.
   * @param params Optional object:
   *   - skip: number (pagination offset)
   *   - take: number (pagination limit)
   * @returns Array of roles matching the criteria
   */
  async getRoles(params?: { skip?: number; take?: number; page?: number }) {
    const { skip = 0, take = 10, page = 1 } = params || {};
    const where: any = {};

    // Get total count
    const total = await this.prismaService.roles.count({ where });

    // Get data
    const data = await this.prismaService.roles.findMany({
      where,
      skip,
      take,
    });

    // Calculate metadata
    const totalPages = Math.ceil(total / take);
    const currentPage = page;
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;

    return {
      data,
      metadata: {
        total,
        page: currentPage,
        limit: take,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }
}
