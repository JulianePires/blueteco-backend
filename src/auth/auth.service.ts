import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { LoginInputDto } from './dto/login-input.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginInputDto: LoginInputDto): Promise<LoginResponseDto> {
    const { email, password } = loginInputDto;

    const userExists = await this.prismaService.user.findUnique({
      where: { email: loginInputDto.email },
    });

    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    const isHashValid = await bcrypt.compare(password, userExists.password);

    if (!isHashValid) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    delete userExists.password;

    return {
      token: this.jwtService.sign({ email }),
      user: userExists,
    };
  }
}
