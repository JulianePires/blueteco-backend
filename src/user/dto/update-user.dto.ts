import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from 'src/shared/enums';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  birthDate: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  @IsOptional()
  role: UserRole;
}
