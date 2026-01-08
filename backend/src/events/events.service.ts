import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  create(createEventDto: CreateEventDto) {
    // categoryId'yi alıp 'category' ilişkisi olarak kaydediyoruz
    const { categoryId, ...eventData } = createEventDto;
    return this.eventRepository.save({
      ...eventData,
      category: { id: categoryId } // NestJS bunu anlar ve ilişkiyi kurar
    });
  }

  findAll(search?: string) {
    if (search) {
      return this.eventRepository.find({
        where: [
          { title: ILike(`%${search}%`) },
          { description: ILike(`%${search}%`) },
          { location: ILike(`%${search}%`) }
        ],
        order: { date: 'ASC' },
        relations: ['category'] // Kategoriyi de getir
      });
    }
    return this.eventRepository.find({
      order: { date: 'ASC' },
      relations: ['category'] // Kategoriyi de getir
    });
  }

  findOne(id: number) {
    return this.eventRepository.findOne({ 
      where: { id },
      relations: ['category'] 
    });
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    const { categoryId, ...eventData } = updateEventDto;
    // Eğer kategori değişecekse onu da güncelleme paketine ekle
    const updateData: any = { ...eventData };
    if (categoryId) {
      updateData.category = { id: categoryId };
    }
    return this.eventRepository.update(id, updateData);
  }

  remove(id: number) {
    return this.eventRepository.delete(id);
  }
}