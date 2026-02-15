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
    return this.concertRepository.save(concert);
  }

  async findAll(): Promise<Concert[]> {
    return this.concertRepository.find();
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
  }

  async decrementSeat(id: string): Promise<void> {
    await this.concertRepository.decrement({ id }, 'seat', 1);
  }

  async incrementSeat(id: string): Promise<void> {
    await this.concertRepository.increment({ id }, 'seat', 1);
  }

  async findAllWithStatus(): Promise<ConcertWithStatus[]> {
    const concerts = await this.concertRepository.find();
    const reservations = await this.reservationRepository.find();

    const reservationMap = new Map(
      reservations.map((r) => [r.concertId, r.id]),
    );

    return concerts.map((concert) => {
      const reservationId = reservationMap.get(concert.id) || null;
      const hasReservation = !!reservationId;

      return {
        ...concert,
        canReserve: !hasReservation && concert.seat > 0,
        canCancel: hasReservation,
        reservationId,
      };
    });
  }
}
