import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Role, Roles, RolesGuard } from './common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('admin-only')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  adminOnly() {
    return { message: 'Admin access granted' };
  }

  @Get('user-area')
  @UseGuards(RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  userArea() {
    return { message: 'User area accessed' };
  }
}
