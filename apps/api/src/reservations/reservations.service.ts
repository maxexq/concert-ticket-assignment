import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import {
  ReservationHistory,
  ReservationAction,
} from './entities/reservation-history.entity';
import { Concert } from '../concerts/entities/concert.entity';
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
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    return this.dataSource.transaction(async (manager) => {
      const concert = await manager.findOne(Concert, {
        where: { id: createReservationDto.concertId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!concert) {
        throw new NotFoundException(
          `Concert with ID ${createReservationDto.concertId} not found`,
        );
      }

      const existingReservation = await manager.findOneBy(Reservation, {
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

      concert.seat -= 1;
      await manager.save(concert);

      const reservation = manager.create(Reservation, {
        concertId: concert.id,
      });
      const saved = await manager.save(reservation);

      await manager.save(ReservationHistory, {
        concertName: concert.name,
        action: ReservationAction.RESERVE,
      });

      await this.invalidateHistoryCache();
      await this.concertsService.invalidateCache();

      console.log(
        `Reservation created for concert ${concert.name}, seats remaining: ${concert.seat}`,
      );

      return saved;
    });
  }

  async findAll(): Promise<Reservation[]> {
    return this.reservationRepository.find({
      relations: ['concert'],
    });
  }

  async cancel(reservationId: string): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const reservation = await manager.findOne(Reservation, {
        where: { id: reservationId },
        relations: ['concert'],
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      const concert = await manager.findOne(Concert, {
        where: { id: reservation.concertId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!concert) {
        throw new NotFoundException('Concert not found');
      }

      concert.seat += 1;
      await manager.save(concert);

      await manager.save(ReservationHistory, {
        concertName: concert.name,
        action: ReservationAction.CANCEL,
      });

      await manager.remove(reservation);

      await this.invalidateHistoryCache();
      await this.concertsService.invalidateCache();

      console.log(`Reservation cancelled for concert ${concert.name}`);
    });
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
    await this.redisService.del(CACHE_KEYS.STATS);
  }

  async getStats(): Promise<{
    totalSeats: number;
    reserveCount: number;
    cancelCount: number;
  }> {
    const cached = await this.redisService.get<{
      totalSeats: number;
      reserveCount: number;
      cancelCount: number;
    }>(CACHE_KEYS.STATS);

    if (cached) {
      return cached;
    }

    const concerts = await this.concertsService.findAll();
    const totalSeats = concerts.reduce((sum, concert) => sum + concert.seat, 0);

    const reserveCount = await this.historyRepository.count({
      where: { action: ReservationAction.RESERVE },
    });

    const cancelCount = await this.historyRepository.count({
      where: { action: ReservationAction.CANCEL },
    });

    const stats = { totalSeats, reserveCount, cancelCount };

    await this.redisService.set(CACHE_KEYS.STATS, stats, CACHE_TTL.STATS);

    return stats;
  }
}
