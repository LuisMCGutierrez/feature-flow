import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Plan, TYPES } from '../entities/plan.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PlansService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Plan)
    private readonly plansRepository: Repository<Plan>,
  ) {}

  async onApplicationBootstrap() {
    const count = await this.plansRepository.count();
    if (count === 0) {
      await this.plansRepository.save([
        { type: TYPES.GOLD },
        { type: TYPES.SILVER },
        { type: TYPES.BRONZE },
      ]);
      console.log('[seed][Plans]: Succesfull.');
    }
  }

  async findPlans(): Promise<Plan[]> {
    return await this.plansRepository.find({
      where: {
        isActive: true,
      },
    });
  }

  async findPlan(id: Plan['id']): Promise<Plan | null> {
    return await this.plansRepository.findOneBy({
      id,
      isActive: true,
    });
  }
}
