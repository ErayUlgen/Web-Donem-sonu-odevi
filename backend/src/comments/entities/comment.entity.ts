import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Event } from '../../events/entities/event.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string; // Yorumun kendisi

  @CreateDateColumn()
  createdAt: Date; // Yazıldığı tarih (Otomatik eklenir)

  // İlişki 1: Yorumu yazan kullanıcı
  @ManyToOne(() => User, (user) => user.comments, { eager: true, onDelete: 'CASCADE' })
  user: User;

  // İlişki 2: Yorum yapılan etkinlik
  @ManyToOne(() => Event, (event) => event.comments, { onDelete: 'CASCADE' })
  event: Event;
}