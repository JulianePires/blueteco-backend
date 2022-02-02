import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ItemCategory } from 'src/shared/enums';

export class UpdateItemDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  price: number;

  @IsEnum(ItemCategory)
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  category: ItemCategory;
}
