import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- Bu eksikti muhtemelen
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './entities/category.entity'; // <-- Entity'i çağır

@Module({
  imports: [TypeOrmModule.forFeature([Category])], // <-- İşte burası! Tabloyu sisteme kaydediyoruz
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [TypeOrmModule] // Başka yerlerde de kullanılabilsin diye dışarı açıyoruz
})
export class CategoriesModule {}