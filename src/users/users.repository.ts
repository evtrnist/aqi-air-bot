import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser({ data }: { data: Prisma.UserCreateInput }): Promise<User> {
    return this.prismaService.user.create({
      data,
    });
  }
}
