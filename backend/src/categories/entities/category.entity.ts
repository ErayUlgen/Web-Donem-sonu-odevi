import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from '../../events/entities/event.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; 

  // Bir kategorinin birden çok etkinliği olur (OneToMany)
  @OneToMany(() => Event, (event) => event.category)
  events: Event[];
}