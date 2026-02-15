import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Concert } from './entities/concert.entity';
import { Reservation } from '../reservations/entities/reservation.entity';
import { CreateConcertDto } from './dto/create-concert.dto';
import { RedisService } from '../common/services/redis.service';
import { CACHE_TTL, CACHE_KEYS } from '../common/constants/cache.constants';

export interface ConcertWithStatus extends Concert {
  canReserve: boolean;
  canCancel: boolean;
  reservationId: string | null;
}

@Injectable()
export class ConcertsService {
  constructor(
    @InjectRepository(Concert)
    private readonly concertRepository: Repository<Concert>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly redisService: RedisService,
  ) {}

  async create(createConcertDto: CreateConcertDto): Promise<Concert> {
    const existing = await this.concertRepository.findOneBy({
      name: createConcertDto.name,
    });

    if (existing) {
      throw new ConflictException(
        `Concert with name "${createConcertDto.name}" already exists`,
      );
    }

    const concert = this.concertRepository.create(createConcertDto);
    const saved = await this.concertRepository.save(concert);

    await this.invalidateCache();

    return saved;
  }

  async findAll(): Promise<Concert[]> {
    const cached = await this.redisService.get<Concert[]>(CACHE_KEYS.CONCERTS);
    if (cached) {
      console.log('Cache HIT:', CACHE_KEYS.CONCERTS);
      return cached;
    }

    console.log('Cache MISS:', CACHE_KEYS.CONCERTS);
    const concerts = await this.concertRepository.find();
    await this.redisService.set(
      CACHE_KEYS.CONCERTS,
      concerts,
      CACHE_TTL.CONCERTS,
    );

    return concerts;
  }

  async findOne(id: string): Promise<Concert> {
    const concert = await this.concertRepository.findOneBy({ id });
    if (!concert) {
      throw new NotFoundException(`Concert with ID ${id} not found`);
    }
    return concert;
  }

  async remove(id: string): Promise<void> {
    const concert = await this.findOne(id);
    await this.concertRepository.remove(concert);

    await this.invalidateCache();
  }

  async decrementSeat(id: string): Promise<void> {
    await this.concertRepository.decrement({ id }, 'seat', 1);
    await this.invalidateCache();
  }

  async incrementSeat(id: string): Promise<void> {
    await this.concertRepository.increment({ id }, 'seat', 1);
    await this.invalidateCache();
  }

  async findAllWithStatus(): Promise<ConcertWithStatus[]> {
    const cached = await this.redisService.get<ConcertWithStatus[]>(
      CACHE_KEYS.CONCERTS_WITH_STATUS,
    );
    if (cached) {
      console.log('Cache HIT:', CACHE_KEYS.CONCERTS_WITH_STATUS);
      return cached;
    }

    console.log('Cache MISS:', CACHE_KEYS.CONCERTS_WITH_STATUS);
    const concerts = await this.concertRepository.find();
    const reservations = await this.reservationRepository.find();

    const reservationMap = new Map(
      reservations.map((r) => [r.concertId, r.id]),
    );

    const result = concerts.map((concert) => {
      const reservationId = reservationMap.get(concert.id) || null;
      const hasReservation = !!reservationId;

      return {
        ...concert,
        canReserve: !hasReservation && concert.seat > 0,
        canCancel: hasReservation,
        reservationId,
      };
    });

    await this.redisService.set(
      CACHE_KEYS.CONCERTS_WITH_STATUS,
      result,
      CACHE_TTL.CONCERTS_WITH_STATUS,
    );

    return result;
  }

  async invalidateCache(): Promise<void> {
    await this.redisService.del(CACHE_KEYS.CONCERTS);
    await this.redisService.del(CACHE_KEYS.CONCERTS_WITH_STATUS);
  }
}
