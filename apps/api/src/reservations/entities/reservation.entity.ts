import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Concert } from '../../concerts/entities/concert.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Concert, { onDelete: 'CASCADE' })
  concert: Concert;

  @Column()
  concertId: string;

  @CreateDateColumn()
  createdAt: Date;
}
