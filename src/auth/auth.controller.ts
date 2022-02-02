import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { LoginInputDto } from './dto/login-input.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoggedUser } from './logged-user-decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiOperation({
    summary: 'Realizar Login',
  })
  login(@Body() loginInputDto: LoginInputDto): Promise<LoginResponseDto> {
    return this.authService.login(loginInputDto);
  }

  @Get()
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Retornar Usuário Logado',
  })
  @ApiBearerAuth()
  me(@LoggedUser() user: User) {
    return user;
  }
}
