import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma.service';
import { jwtConstants } from './jwt.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: { email: string }) {
    const validatedUser = await this.prismaService.user.findUnique({
      where: { email: payload.email },
    });

    if (!validatedUser) {
      throw new NotFoundException('User not found or not authenticated');
    }

    return validatedUser;
  }
}
