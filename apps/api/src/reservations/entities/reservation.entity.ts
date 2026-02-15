import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Concert } from '../../concerts/entities/concert.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ default: 'Sara John' })
  username: string;

  @Index()
  @Column()
  concertId: string;

  @ManyToOne(() => Concert, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'concertId' })
  concert: Concert;

  @Index()
  @CreateDateColumn()
  createdAt: Date;
}
