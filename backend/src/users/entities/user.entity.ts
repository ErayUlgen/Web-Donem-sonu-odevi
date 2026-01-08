import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from '../../comments/entities/comment.entity';
import { Event } from '../../events/entities/event.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 'user' })
  role: string;

  // İlişki: Yorumlar
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  // --- YENİ EKLENEN FAVORİLER İLİŞKİSİ ---
  // ManyToMany: Bir kullanıcının çok favorisi olabilir
  @ManyToMany(() => Event)
  @JoinTable() // Bu, arka planda "user_favorites_event" diye ara bir tablo oluşturur
  favorites: Event[];
  // ----------------------------------------
}