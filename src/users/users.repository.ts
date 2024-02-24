import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { UpdateUserDto } from './dtos/update-user-dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser({ data }: { data: Prisma.UserCreateInput }): Promise<User> {
    return this.prismaService.user.create({
      data,
    });
  }

  async findAllUsers() {
    return this.prismaService.user.findMany({
      select: {
        id: true,
        subscriptions: true,
        timeZone: true,
        time: true,
      },
    });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return await this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async findUser(id: number): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: { id },
    });
  }
}
