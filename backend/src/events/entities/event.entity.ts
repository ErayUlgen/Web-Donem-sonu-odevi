import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  date: string;

  @Column()
  location: string;

  @Column({ default: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30' })
  imageUrl: string;

  @Column({ default: false })
  isFree: boolean;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Category, (category) => category.events, { eager: true, onDelete: 'SET NULL' })
  category: Category;

  @OneToMany(() => Comment, (comment) => comment.event)
  comments: Comment[];

  // --- YENİ EKLENEN İLİŞKİ ---
  // Etkinliği favorileyen kullanıcılar
  @ManyToMany(() => User, (user) => user.favorites)
  favoritedBy: User[];
  // ---------------------------
}