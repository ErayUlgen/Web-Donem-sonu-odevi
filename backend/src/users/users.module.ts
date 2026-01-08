import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Event } from '../events/entities/event.entity'; // <-- Bunu ekle

@Module({
  imports: [TypeOrmModule.forFeature([User, Event])], // <-- Event'i buraya da ekle
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}