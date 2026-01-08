import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateEventDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isFree: boolean;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(0)
  price?: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  categoryId: number;
}