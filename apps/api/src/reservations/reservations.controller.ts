import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Role, Roles, RolesGuard } from '../common';

@Controller('reservations')
@UseGuards(RolesGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @Roles(Role.USER)
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(createReservationDto);
  }

  @Get()
  @Roles(Role.USER)
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get('stats')
  @Roles(Role.ADMIN)
  getStats() {
    return this.reservationsService.getStats();
  }

  @Get('history')
  @Roles(Role.ADMIN)
  getHistory() {
    return this.reservationsService.getHistory();
  }

  @Get('my-history')
  @Roles(Role.USER)
  getMyHistory() {
    return this.reservationsService.getHistoryForUser();
  }

  @Delete(':id')
  @Roles(Role.USER)
  cancel(@Param('id', ParseUUIDPipe) id: string) {
    return this.reservationsService.cancel(id);
  }
}
