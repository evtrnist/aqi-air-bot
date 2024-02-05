import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dtos/create-user-dto';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dtos/update-user-dto';

@Injectable()
export class UsersService {
  public readonly usersSnapshot: Record<string, User> = {};

  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(user: CreateUserDto) {
    return this.usersRepository.createUser({ data: user });
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const updatedUser = await this.usersRepository.updateUser(
      userId,
      updateUserDto,
    );

    if (this.usersSnapshot[userId]) {
      this.usersSnapshot[userId] = updatedUser;
    }

    return updatedUser;
  }

  async findAllUsers(): Promise<User[]> {
    return this.usersRepository.findAllUsers();
  }

  async loadUsersSnapshot() {
    const users = await this.usersRepository.findAllUsers();

    for (const user of users) {
      this.usersSnapshot[user.id] = user;
    }

    console.log('Снепшот пользователей загружен');
    console.log(this.usersSnapshot);
  }
}
