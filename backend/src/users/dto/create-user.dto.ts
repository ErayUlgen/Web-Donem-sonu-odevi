import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  // --- YENİ EKLENEN KISIM ---
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Şifre en az 6 karakter olmalı' })
  password: string;
  // --------------------------
}