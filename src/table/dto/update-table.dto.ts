import { ApiProperty } from '@nestjs/swagger';
import { User, State } from '@prisma/client';
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsArray,
} from 'class-validator';

export class UpdateTableDto {
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  user: User;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  userId: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  couvert: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  service: boolean;

  @IsEnum(State)
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  state: State;

  @IsString({ each: true })
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  items: string[];
}
