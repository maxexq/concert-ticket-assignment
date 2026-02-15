import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import {
  ReservationHistory,
  ReservationAction,
} from './entities/reservation-history.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ConcertsService } from '../concerts/concerts.service';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(ReservationHistory)
    private readonly historyRepository: Repository<ReservationHistory>,
    private readonly concertsService: ConcertsService,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const concert = await this.concertsService.findOne(
      createReservationDto.concertId,
    );

    const reservationCount = await this.reservationRepository.countBy({
      concertId: concert.id,
    });

    if (reservationCount >= concert.seat) {
      throw new BadRequestException('No seats available for this concert');
    }

    const reservation = this.reservationRepository.create({
      concertId: concert.id,
    });

    const saved = await this.reservationRepository.save(reservation);

    await this.historyRepository.save({
      concertName: concert.name,
      action: ReservationAction.RESERVE,
    });

    return saved;
  }

  async findAll(): Promise<Reservation[]> {
    return this.reservationRepository.find({
      relations: ['concert'],
    });
  }

  async cancel(reservationId: string): Promise<void> {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
      relations: ['concert'],
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    await this.historyRepository.save({
      concertName: reservation.concert.name,
      action: ReservationAction.CANCEL,
    });

    await this.reservationRepository.remove(reservation);
  }

  async getHistory(): Promise<ReservationHistory[]> {
    return this.historyRepository.find({
      order: { dateTime: 'DESC' },
    });
  }
}
