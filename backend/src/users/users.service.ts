import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Event } from '../events/entities/event.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Event) // Event tablosunu da kullanacağız
    private eventRepository: Repository<Event>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  findAll(name?: string) {
    if (name) {
      return this.userRepository.find({
        where: [
          { firstName: ILike(`%${name}%`) }, 
          { lastName: ILike(`%${name}%`) }
        ],
        order: { id: 'DESC' }
      });
    }
    return this.userRepository.find({
      order: { id: 'DESC' }
    });
  }

  // Kullanıcıyı getirirken favorilerini de getir (relations: ['favorites'])
  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['favorites'] 
    });
  }

  async findOneByEmail(email: string) {
    return this.userRepository.findOne({ where: { email }, relations: ['favorites'] });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  async toggleStatus(id: number) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('Kullanıcı bulunamadı');
    user.isActive = !user.isActive;
    return this.userRepository.save(user);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

  // --- YENİ: FAVORİYE EKLE ---
  async addFavorite(userId: number, eventId: number) {
    const user = await this.findOne(userId);
    const event = await this.eventRepository.findOneBy({ id: eventId });

    if (!user || !event) throw new NotFoundException('Kullanıcı veya etkinlik bulunamadı');

    // Zaten ekli mi kontrol et
    const isAlreadyFavorited = user.favorites.some(fav => fav.id === eventId);
    if (!isAlreadyFavorited) {
      user.favorites.push(event); // Listeye ekle
      await this.userRepository.save(user); // Kaydet
    }
    
    return { message: 'Favorilere eklendi', favorites: user.favorites };
  }

  // --- YENİ: FAVORİDEN ÇIKAR ---
  async removeFavorite(userId: number, eventId: number) {
    const user = await this.findOne(userId);
    if (!user) throw new NotFoundException('Kullanıcı bulunamadı');

    // Listeyi filtrele (Çıkarılacak olanı at)
    user.favorites = user.favorites.filter(fav => fav.id !== eventId);
    await this.userRepository.save(user);

    return { message: 'Favorilerden çıkarıldı', favorites: user.favorites };
  }
}