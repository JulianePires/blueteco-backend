import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { UserRole } from 'src/shared/enums';
import { CreateUserDto } from './dto/create-user.dto';
import { ReturnUserDto } from './dto/return-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<ReturnUserDto> {
    const userEmailExists = await this.prismaService.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (userEmailExists) {
      throw new ConflictException('Email já cadastrado');
    }

    if (createUserDto.password !== createUserDto.passwordConfirmation) {
      throw new ConflictException('Senhas digitadas não conferem');
    }

    delete createUserDto.passwordConfirmation;

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const createdUser = await this.prismaService.user.create({
      data: {
        ...createUserDto,

        password: hashedPassword,
      },
    });

    delete createdUser.password;

    return {
      user: { ...createdUser, role: UserRole[createdUser.role] },
      message: 'User created successfully',
    };
  }

  async findMany(): Promise<UserDto[]> {
    const users = await this.prismaService.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        birthDate: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const updatedUsers = users.map(
      (user) => (user = { ...user, role: UserRole[user.role] }),
    );

    return updatedUsers;
  }

  async findUnique(userId: string): Promise<ReturnUserDto> {
    const userFinded = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userFinded) {
      throw new NotFoundException('User not found');
    }

    delete userFinded.password;

    return {
      user: { ...userFinded, role: UserRole[userFinded.role] },
      message: 'User finded successfully',
    };
  }

  async update(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ReturnUserDto> {
    const userFinded = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!userFinded) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.email) {
      const emailExists = await this.prismaService.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (emailExists) {
        throw new ConflictException('Email already exists');
      }
    }

    const updatedUser = await this.prismaService.user.update({
      where: { id: userId },
      data: {
        email: updateUserDto.email,
        name: updateUserDto.name,
        birthDate: updateUserDto.birthDate,
        role: updateUserDto.role,
      },
    });

    delete updatedUser.password;

    return {
      user: { ...updatedUser, role: UserRole[updatedUser.role] },
      message: 'User updated successfully',
    };
  }

  async delete(userId: string) {
    const userFinded = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!userFinded) {
      throw new NotFoundException('User not found');
    }

    const deletedUser = await this.prismaService.user.delete({
      where: { id: userId },
    });

    delete deletedUser.password;

    return {
      user: { ...deletedUser, role: UserRole[deletedUser.role] },
      message: 'User deleted successfully',
    };
  }
}
