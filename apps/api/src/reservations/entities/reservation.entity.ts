import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Concert } from '../../concerts/entities/concert.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'Sara John' })
  username: string;

  @Column()
  concertId: string;

  @ManyToOne(() => Concert, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'concertId' })
  concert: Concert;

  @CreateDateColumn()
  createdAt: Date;
}
