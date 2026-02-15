import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { Reservation } from './entities/reservation.entity';
import {
  ReservationHistory,
  ReservationAction,
} from './entities/reservation-history.entity';
import { Concert } from '../concerts/entities/concert.entity';
import { ConcertsService } from '../concerts/concerts.service';
import { RedisService } from '../common/services/redis.service';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let reservationRepository: jest.Mocked<Repository<Reservation>>;
  let historyRepository: jest.Mocked<Repository<ReservationHistory>>;
  let concertsService: jest.Mocked<ConcertsService>;
  let redisService: jest.Mocked<RedisService>;
  let dataSource: jest.Mocked<DataSource>;

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
    username: 'Sara John',
    concertId: mockConcert.id,
    concert: mockConcert,
    createdAt: new Date(),
  };

  const mockHistory: ReservationHistory = {
    id: '323e4567-e89b-12d3-a456-426614174002',
    username: 'Sara John',
    concertName: mockConcert.name,
    action: ReservationAction.RESERVE,
    dateTime: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: getRepositoryToken(Reservation),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ReservationHistory),
          useValue: {
            find: jest.fn(),
            count: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: ConcertsService,
          useValue: {
            findAll: jest.fn(),
            invalidateCache: jest.fn(),
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
        {
          provide: DataSource,
          useValue: {
            transaction: jest.fn((cb: (manager: unknown) => Promise<unknown>) => cb),
          },
        },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    reservationRepository = module.get(getRepositoryToken(Reservation));
    historyRepository = module.get(getRepositoryToken(ReservationHistory));
    concertsService = module.get(ConcertsService);
    redisService = module.get(RedisService);
    dataSource = module.get(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all reservations with concert relations', async () => {
      const reservations = [mockReservation];
      reservationRepository.find.mockResolvedValue(reservations);

      const result = await service.findAll();

      expect(reservationRepository.find).toHaveBeenCalledWith({
        relations: ['concert'],
      });
      expect(result).toEqual(reservations);
    });
  });

  describe('getHistory', () => {
    it('should return cached history if available', async () => {
      const cachedHistory = [mockHistory];
      redisService.get.mockResolvedValue(cachedHistory);

      const result = await service.getHistory();

      expect(redisService.get).toHaveBeenCalled();
      expect(historyRepository.find).not.toHaveBeenCalled();
      expect(result).toEqual(cachedHistory);
    });

    it('should fetch from database and cache if no cache', async () => {
      const history = [mockHistory];
      redisService.get.mockResolvedValue(null);
      historyRepository.find.mockResolvedValue(history);
      redisService.set.mockResolvedValue(undefined);

      const result = await service.getHistory();

      expect(historyRepository.find).toHaveBeenCalledWith({
        order: { dateTime: 'DESC' },
      });
      expect(redisService.set).toHaveBeenCalled();
      expect(result).toEqual(history);
    });
  });

  describe('getHistoryForUser', () => {
    it('should return cached user history if available', async () => {
      const cachedHistory = [mockHistory];
      redisService.get.mockResolvedValue(cachedHistory);

      const result = await service.getHistoryForUser();

      expect(redisService.get).toHaveBeenCalled();
      expect(result).toEqual(cachedHistory);
    });

    it('should fetch user history from database if no cache', async () => {
      const history = [mockHistory];
      redisService.get.mockResolvedValue(null);
      historyRepository.find.mockResolvedValue(history);
      redisService.set.mockResolvedValue(undefined);

      const result = await service.getHistoryForUser();

      expect(historyRepository.find).toHaveBeenCalledWith({
        select: ['id', 'concertName', 'action', 'dateTime'],
        order: { dateTime: 'DESC' },
      });
      expect(result).toEqual(history);
    });
  });

  describe('getStats', () => {
    it('should return cached stats if available', async () => {
      const cachedStats = { totalSeats: 100, reserveCount: 10, cancelCount: 5 };
      redisService.get.mockResolvedValue(cachedStats);

      const result = await service.getStats();

      expect(redisService.get).toHaveBeenCalled();
      expect(result).toEqual(cachedStats);
    });

    it('should compute stats from database if no cache', async () => {
      redisService.get.mockResolvedValue(null);
      concertsService.findAll.mockResolvedValue([mockConcert]);
      historyRepository.count
        .mockResolvedValueOnce(10) // reserve count
        .mockResolvedValueOnce(5); // cancel count
      redisService.set.mockResolvedValue(undefined);

      const result = await service.getStats();

      expect(concertsService.findAll).toHaveBeenCalled();
      expect(historyRepository.count).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        totalSeats: 100,
        reserveCount: 10,
        cancelCount: 5,
      });
    });
  });

  describe('create', () => {
    it('should create a reservation within transaction', async () => {
      const mockManager = {
        findOne: jest.fn(),
        findOneBy: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
      };

      mockManager.findOne.mockResolvedValueOnce({ ...mockConcert, seat: 10 });
      mockManager.findOneBy.mockResolvedValue(null);
      mockManager.create.mockReturnValue(mockReservation);
      mockManager.save.mockResolvedValue(mockReservation);

      (dataSource.transaction as jest.Mock).mockImplementation(
        async (cb: (manager: typeof mockManager) => Promise<Reservation>) => {
          return cb(mockManager);
        },
      );

      redisService.del.mockResolvedValue(undefined);
      concertsService.invalidateCache.mockResolvedValue(undefined);

      const result = await service.create({ concertId: mockConcert.id });

      expect(dataSource.transaction).toHaveBeenCalled();
      expect(result).toEqual(mockReservation);
    });

    it('should throw NotFoundException if concert not found', async () => {
      const mockManager = {
        findOne: jest.fn().mockResolvedValue(null),
      };

      (dataSource.transaction as jest.Mock).mockImplementation(
        async (cb: (manager: typeof mockManager) => Promise<Reservation>) => {
          return cb(mockManager);
        },
      );

      await expect(
        service.create({ concertId: 'non-existent' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if already reserved', async () => {
      const mockManager = {
        findOne: jest.fn().mockResolvedValue(mockConcert),
        findOneBy: jest.fn().mockResolvedValue(mockReservation),
      };

      (dataSource.transaction as jest.Mock).mockImplementation(
        async (cb: (manager: typeof mockManager) => Promise<Reservation>) => {
          return cb(mockManager);
        },
      );

      await expect(
        service.create({ concertId: mockConcert.id }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException if no seats available', async () => {
      const mockManager = {
        findOne: jest.fn().mockResolvedValue({ ...mockConcert, seat: 0 }),
        findOneBy: jest.fn().mockResolvedValue(null),
      };

      (dataSource.transaction as jest.Mock).mockImplementation(
        async (cb: (manager: typeof mockManager) => Promise<Reservation>) => {
          return cb(mockManager);
        },
      );

      await expect(
        service.create({ concertId: mockConcert.id }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('cancel', () => {
    it('should cancel a reservation within transaction', async () => {
      const mockManager = {
        findOne: jest.fn(),
        save: jest.fn(),
        remove: jest.fn(),
      };

      mockManager.findOne
        .mockResolvedValueOnce({ ...mockReservation, concert: mockConcert })
        .mockResolvedValueOnce(mockConcert);
      mockManager.save.mockResolvedValue(undefined);
      mockManager.remove.mockResolvedValue(undefined);

      (dataSource.transaction as jest.Mock).mockImplementation(
        async (cb: (manager: typeof mockManager) => Promise<void>) => {
          return cb(mockManager);
        },
      );

      redisService.del.mockResolvedValue(undefined);
      concertsService.invalidateCache.mockResolvedValue(undefined);

      await service.cancel(mockReservation.id);

      expect(dataSource.transaction).toHaveBeenCalled();
      expect(mockManager.remove).toHaveBeenCalled();
    });

    it('should throw NotFoundException if reservation not found', async () => {
      const mockManager = {
        findOne: jest.fn().mockResolvedValue(null),
      };

      (dataSource.transaction as jest.Mock).mockImplementation(
        async (cb: (manager: typeof mockManager) => Promise<void>) => {
          return cb(mockManager);
        },
      );

      await expect(service.cancel('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
