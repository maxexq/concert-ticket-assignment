import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
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
import { RedisService } from '../common/services/redis.service';
import { CACHE_TTL, CACHE_KEYS } from '../common/constants/cache.constants';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(ReservationHistory)
    private readonly historyRepository: Repository<ReservationHistory>,
    private readonly concertsService: ConcertsService,
    private readonly redisService: RedisService,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const concert = await this.concertsService.findOne(
      createReservationDto.concertId,
    );

    const existingReservation = await this.reservationRepository.findOneBy({
      concertId: concert.id,
    });

    if (existingReservation) {
      throw new ConflictException(
        'You already have a reservation for this concert',
      );
    }

    if (concert.seat <= 0) {
      throw new BadRequestException('No seats available for this concert');
    }

    const reservation = this.reservationRepository.create({
      concertId: concert.id,
    });

    const saved = await this.reservationRepository.save(reservation);

    await this.concertsService.decrementSeat(concert.id);

    await this.historyRepository.save({
      concertName: concert.name,
      action: ReservationAction.RESERVE,
    });

    await this.invalidateHistoryCache();

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

    await this.concertsService.incrementSeat(reservation.concertId);

    await this.historyRepository.save({
      concertName: reservation.concert.name,
      action: ReservationAction.CANCEL,
    });

    await this.reservationRepository.remove(reservation);

    await this.invalidateHistoryCache();
  }

  async getHistory(): Promise<ReservationHistory[]> {
    const cached = await this.redisService.get<ReservationHistory[]>(
      CACHE_KEYS.HISTORY,
    );
    if (cached) {
      return cached;
    }

    const history = await this.historyRepository.find({
      order: { dateTime: 'DESC' },
    });

    await this.redisService.set(CACHE_KEYS.HISTORY, history, CACHE_TTL.HISTORY);

    return history;
  }

  async getHistoryForUser() {
    const cached = await this.redisService.get(CACHE_KEYS.HISTORY_USER);
    if (cached) {
      return cached;
    }

    const history = await this.historyRepository.find({
      select: ['id', 'concertName', 'action', 'dateTime'],
      order: { dateTime: 'DESC' },
    });

    await this.redisService.set(
      CACHE_KEYS.HISTORY_USER,
      history,
      CACHE_TTL.HISTORY,
    );

    return history;
  }

  private async invalidateHistoryCache(): Promise<void> {
    await this.redisService.del(CACHE_KEYS.HISTORY);
    await this.redisService.del(CACHE_KEYS.HISTORY_USER);
  }
}
