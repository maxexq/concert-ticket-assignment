import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum ReservationAction {
  RESERVE = 'reserve',
  CANCEL = 'cancel',
}

@Entity('reservation_history')
export class ReservationHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ default: 'Sara John' })
  username: string;

  @Index()
  @Column()
  concertName: string;

  @Index()
  @Column({
    type: 'varchar',
  })
  action: ReservationAction;

  @Index()
  @CreateDateColumn({ type: 'timestamptz' })
  dateTime: Date;
}
