import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from 'src/shared/enums';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  birthDate: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;
}
