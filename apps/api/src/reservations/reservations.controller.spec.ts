import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { Reservation } from './entities/reservation.entity';
import {
  ReservationHistory,
  ReservationAction,
} from './entities/reservation-history.entity';
import { Concert } from '../concerts/entities/concert.entity';

describe('ReservationsController', () => {
  let controller: ReservationsController;
  let service: jest.Mocked<ReservationsService>;

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
      controllers: [ReservationsController],
      providers: [
        Reflector,
        {
          provide: ReservationsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            getHistory: jest.fn(),
            getHistoryForUser: jest.fn(),
            getStats: jest.fn(),
            cancel: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ReservationsController>(ReservationsController);
    service = module.get(ReservationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a reservation', async () => {
      const createDto = { concertId: mockConcert.id };
      service.create.mockResolvedValue(mockReservation);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockReservation);
    });
  });

  describe('findAll', () => {
    it('should return all reservations', async () => {
      const reservations = [mockReservation];
      service.findAll.mockResolvedValue(reservations);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(reservations);
    });
  });

  describe('getStats', () => {
    it('should return stats', async () => {
      const stats = { totalSeats: 100, reserveCount: 10, cancelCount: 5 };
      service.getStats.mockResolvedValue(stats);

      const result = await controller.getStats();

      expect(service.getStats).toHaveBeenCalled();
      expect(result).toEqual(stats);
    });
  });

  describe('getHistory', () => {
    it('should return all history', async () => {
      const history = [mockHistory];
      service.getHistory.mockResolvedValue(history);

      const result = await controller.getHistory();

      expect(service.getHistory).toHaveBeenCalled();
      expect(result).toEqual(history);
    });
  });

  describe('getMyHistory', () => {
    it('should return user history', async () => {
      const history = [mockHistory];
      service.getHistoryForUser.mockResolvedValue(history);

      const result = await controller.getMyHistory();

      expect(service.getHistoryForUser).toHaveBeenCalled();
      expect(result).toEqual(history);
    });
  });

  describe('cancel', () => {
    it('should cancel a reservation', async () => {
      service.cancel.mockResolvedValue(undefined);

      await controller.cancel(mockReservation.id);

      expect(service.cancel).toHaveBeenCalledWith(mockReservation.id);
    });
  });
});
