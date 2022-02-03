import { State, User } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class TableDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsInt()
  number: number;

  @IsNotEmpty()
  user: User;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  couvert: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  service: boolean;

  @IsEnum(State)
  @IsNotEmpty()
  state: State;

  @IsString({ each: true })
  @IsArray()
  @IsNotEmpty()
  items: string[];

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;
}
