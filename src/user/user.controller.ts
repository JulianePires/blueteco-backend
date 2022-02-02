import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

import { ReturnUserDto } from './dto/return-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { LoggedUser } from 'src/auth/logged-user-decorator';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um usuário',
  })
  create(@Body() createUserDto: CreateUserDto): Promise<ReturnUserDto> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Buscar todos os usuários cadastrados',
  })
  findMany(): Promise<UserDto[]> {
    return this.userService.findMany();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Listar um usuário pelo seu ID',
  })
  findUnique(@Param('id') userId: string): Promise<ReturnUserDto> {
    return this.userService.findUnique(userId);
  }

  @Patch()
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Atualizar usuário autenticado',
  })
  @ApiBearerAuth()
  update(
    @LoggedUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ReturnUserDto> {
    return this.userService.update(user.id, updateUserDto);
  }

  @Delete()
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Deletar usuário autenticado',
  })
  @ApiBearerAuth()
  delete(@LoggedUser() user: User) {
    return this.userService.delete(user.id);
  }
}
