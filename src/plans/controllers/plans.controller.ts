import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { PlansService } from '../services/plans.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { Request } from 'express';
import { Plan } from '../entities/plan.entity';
import { UsersService } from 'src/users/services/users.service';
import { User } from 'src/users/entities/user.entity';

@Controller('plans')
export class PlansController {
  constructor(
    private readonly plansService: PlansService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  getAll() {
    return this.plansService.findPlans();
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  subscribeToPlan(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: Plan['id'],
  ) {
    const user = req.user as User;
    if (!user || !user.id) throw new UnauthorizedException();
    return this.usersService.assignPlanToUser(user.id, id);
  }
}
