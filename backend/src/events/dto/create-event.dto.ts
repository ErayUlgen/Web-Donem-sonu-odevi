import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import { Type, Transform } from 'class-transformer'; // <-- BU İKİSİ YENİ EKLENDİ

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

  // --- BURASI DEĞİŞTİ ---
  // FormData "true" kelimesini string gönderir. Bunu boolean true'ya çeviriyoruz.
  @ApiProperty()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true) 
  isFree: boolean;

  // --- BURASI DEĞİŞTİ ---
  // FormData sayıyı "5" diye string gönderir. Bunu Number'a çeviriyoruz.
  @ApiProperty()
  @IsNumber()
  @Type(() => Number) 
  @IsNotEmpty()
  categoryId: number;
}