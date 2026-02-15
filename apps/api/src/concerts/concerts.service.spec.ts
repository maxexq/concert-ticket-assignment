import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { Concert } from './entities/concert.entity';
import { Reservation } from '../reservations/entities/reservation.entity';
import { RedisService } from '../common/services/redis.service';

describe('ConcertsService', () => {
  let service: ConcertsService;
  let concertRepository: jest.Mocked<Repository<Concert>>;
  let reservationRepository: jest.Mocked<Repository<Reservation>>;
  let redisService: jest.Mocked<RedisService>;

  const mockConcert: Concert = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Concert',
    description: 'Test Description',
    seat: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockReservation: Reservation = {
    id: '223e4567-e89b-12d3-a456-426614174001',
    username: 'testuser',
    concertId: mockConcert.id,
    concert: mockConcert,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertsService,
        {
          provide: getRepositoryToken(Concert),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            decrement: jest.fn(),
            increment: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Reservation),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ConcertsService>(ConcertsService);
    concertRepository = module.get(getRepositoryToken(Concert));
    reservationRepository = module.get(getRepositoryToken(Reservation));
    redisService = module.get(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createDto = {
      name: 'New Concert',
      description: 'New Description',
      seat: 50,
    };

    it('should create a concert successfully', async () => {
      concertRepository.findOneBy.mockResolvedValue(null);
      concertRepository.create.mockReturnValue(mockConcert);
      concertRepository.save.mockResolvedValue(mockConcert);
      redisService.del.mockResolvedValue(undefined);

      const result = await service.create(createDto);

      expect(concertRepository.findOneBy).toHaveBeenCalledWith({
        name: createDto.name,
      });
      expect(concertRepository.create).toHaveBeenCalledWith(createDto);
      expect(concertRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockConcert);
    });

    it('should throw ConflictException if concert name already exists', async () => {
      concertRepository.findOneBy.mockResolvedValue(mockConcert);

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return cached concerts if available', async () => {
      const cachedConcerts = [mockConcert];
      redisService.get.mockResolvedValue(cachedConcerts);

      const result = await service.findAll();

      expect(redisService.get).toHaveBeenCalled();
      expect(concertRepository.find).not.toHaveBeenCalled();
      expect(result).toEqual(cachedConcerts);
    });

    it('should fetch from database and cache if no cache', async () => {
      const concerts = [mockConcert];
      redisService.get.mockResolvedValue(null);
      concertRepository.find.mockResolvedValue(concerts);
      redisService.set.mockResolvedValue(undefined);

      const result = await service.findAll();

      expect(concertRepository.find).toHaveBeenCalled();
      expect(redisService.set).toHaveBeenCalled();
      expect(result).toEqual(concerts);
    });
  });

  describe('findOne', () => {
    it('should return a concert by id', async () => {
      concertRepository.findOneBy.mockResolvedValue(mockConcert);

      const result = await service.findOne(mockConcert.id);

      expect(concertRepository.findOneBy).toHaveBeenCalledWith({
        id: mockConcert.id,
      });
      expect(result).toEqual(mockConcert);
    });

    it('should throw NotFoundException if concert not found', async () => {
      concertRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a concert successfully', async () => {
      concertRepository.findOneBy.mockResolvedValue(mockConcert);
      concertRepository.remove.mockResolvedValue(mockConcert);
      redisService.del.mockResolvedValue(undefined);

      await service.remove(mockConcert.id);

      expect(concertRepository.remove).toHaveBeenCalledWith(mockConcert);
      expect(redisService.del).toHaveBeenCalled();
    });

    it('should throw NotFoundException if concert not found', async () => {
      concertRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAllWithStatus', () => {
    it('should return cached data if available', async () => {
      const cachedData = [
        {
          ...mockConcert,
          canReserve: true,
          canCancel: false,
          reservationId: null,
        },
      ];
      redisService.get.mockResolvedValue(cachedData);

      const result = await service.findAllWithStatus();

      expect(redisService.get).toHaveBeenCalled();
      expect(result).toEqual(cachedData);
    });

    it('should compute status when no cache', async () => {
      redisService.get.mockResolvedValue(null);
      concertRepository.find.mockResolvedValue([mockConcert]);
      reservationRepository.find.mockResolvedValue([]);
      redisService.set.mockResolvedValue(undefined);

      const result = await service.findAllWithStatus();

      expect(result[0].canReserve).toBe(true);
      expect(result[0].canCancel).toBe(false);
      expect(result[0].reservationId).toBeNull();
    });

    it('should set canCancel true when reservation exists', async () => {
      redisService.get.mockResolvedValue(null);
      concertRepository.find.mockResolvedValue([mockConcert]);
      reservationRepository.find.mockResolvedValue([mockReservation]);
      redisService.set.mockResolvedValue(undefined);

      const result = await service.findAllWithStatus();

      expect(result[0].canReserve).toBe(false);
      expect(result[0].canCancel).toBe(true);
      expect(result[0].reservationId).toBe(mockReservation.id);
    });
  });

  describe('decrementSeat', () => {
    it('should decrement seat count', async () => {
      concertRepository.decrement.mockResolvedValue({
        affected: 1,
        raw: {},
        generatedMaps: [],
      });
      redisService.del.mockResolvedValue(undefined);

      await service.decrementSeat(mockConcert.id);

      expect(concertRepository.decrement).toHaveBeenCalledWith(
        { id: mockConcert.id },
        'seat',
        1,
      );
    });
  });

  describe('incrementSeat', () => {
    it('should increment seat count', async () => {
      concertRepository.increment.mockResolvedValue({
        affected: 1,
        raw: {},
        generatedMaps: [],
      });
      redisService.del.mockResolvedValue(undefined);

      await service.incrementSeat(mockConcert.id);

      expect(concertRepository.increment).toHaveBeenCalledWith(
        { id: mockConcert.id },
        'seat',
        1,
      );
    });
  });
});
