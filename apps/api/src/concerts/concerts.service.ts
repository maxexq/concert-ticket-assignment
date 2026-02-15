import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Concert } from './entities/concert.entity';
import { CreateConcertDto } from './dto/create-concert.dto';

@Injectable()
export class ConcertsService {
  constructor(
    @InjectRepository(Concert)
    private readonly concertRepository: Repository<Concert>,
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
}
