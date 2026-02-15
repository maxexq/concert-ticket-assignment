import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { Reservation } from './entities/reservation.entity';
import { ReservationHistory } from './entities/reservation-history.entity';
import { ConcertsModule } from '../concerts/concerts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, ReservationHistory]),
    ConcertsModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
