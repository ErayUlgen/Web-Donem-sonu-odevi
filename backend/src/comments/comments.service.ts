import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  create(createCommentDto: CreateCommentDto, userId: number) {
    return this.commentRepository.save({
      content: createCommentDto.content,
      event: { id: createCommentDto.eventId },
      user: { id: userId }, // Token'dan gelen kullanıcı ID'si
    });
  }

  findByEvent(eventId: number) {
    return this.commentRepository.find({
      where: { event: { id: eventId } },
      order: { createdAt: 'DESC' }, // En yeni yorum en üstte
      relations: ['user'], // Yorumu yazan kullanıcıyı da getir
    });
  }

  remove(id: number) {
    return this.commentRepository.delete(id);
  }
}