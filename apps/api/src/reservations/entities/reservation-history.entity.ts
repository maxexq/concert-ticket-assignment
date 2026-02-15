import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum ReservationAction {
  RESERVE = 'reserve',
  CANCEL = 'cancel',
}

@Entity('reservation_history')
export class ReservationHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'Sara John' })
  username: string;

  @Column()
  concertName: string;

  @Column({
    type: 'varchar',
  })
  action: ReservationAction;

  @CreateDateColumn()
  dateTime: Date;
}
