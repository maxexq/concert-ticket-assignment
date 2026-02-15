import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ConcertsController } from './concerts.controller';
import { ConcertsService } from './concerts.service';
import { Concert } from './entities/concert.entity';
import { CreateConcertDto } from './dto/create-concert.dto';

describe('ConcertsController', () => {
  let controller: ConcertsController;
  let service: jest.Mocked<ConcertsService>;

  const mockConcert: Concert = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Concert',
    description: 'Test Description',
    seat: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConcertsController],
      providers: [
        Reflector,
        {
          provide: ConcertsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findAllWithStatus: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ConcertsController>(ConcertsController);
    service = module.get(ConcertsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a concert', async () => {
      const createDto: CreateConcertDto = {
        name: 'New Concert',
        description: 'Description',
        seat: 50,
      };
      service.create.mockResolvedValue(mockConcert);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockConcert);
    });
  });

  describe('findAll', () => {
    it('should return all concerts', async () => {
      const concerts = [mockConcert];
      service.findAll.mockResolvedValue(concerts);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(concerts);
    });
  });

  describe('findAllWithStatus', () => {
    it('should return concerts with status', async () => {
      const concertsWithStatus = [
        {
          ...mockConcert,
          canReserve: true,
          canCancel: false,
          reservationId: null,
        },
      ];
      service.findAllWithStatus.mockResolvedValue(concertsWithStatus);

      const result = await controller.findAllWithStatus();

      expect(service.findAllWithStatus).toHaveBeenCalled();
      expect(result).toEqual(concertsWithStatus);
    });
  });

  describe('findOne', () => {
    it('should return a concert by id', async () => {
      service.findOne.mockResolvedValue(mockConcert);

      const result = await controller.findOne(mockConcert.id);

      expect(service.findOne).toHaveBeenCalledWith(mockConcert.id);
      expect(result).toEqual(mockConcert);
    });
  });

  describe('remove', () => {
    it('should remove a concert', async () => {
      service.remove.mockResolvedValue(undefined);

      await controller.remove(mockConcert.id);

      expect(service.remove).toHaveBeenCalledWith(mockConcert.id);
    });
  });
});
