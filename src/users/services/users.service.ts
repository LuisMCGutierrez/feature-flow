import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user-dto';
import { UpdateUserDto } from '../dtos/update-user-dto';
import * as bcrypt from 'bcrypt';
import { Plan } from 'src/plans/entities/plan.entity';
import { PlansService } from 'src/plans/services/plans.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly plansService: PlansService,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: User['id']): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException();
    return user;
  }

  async findOneByEmailWithPassword(email: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const emailExists = await this.userRepository.findOneBy({
      email: dto.email,
    });
    if (emailExists) throw new ConflictException();

    const hashedPasssword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({
      ...dto,
      password: hashedPasssword,
    });

    return await this.userRepository.save(user);
  }

  async update(id: User['id'], dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, dto);
    return await this.userRepository.save(user);
  }

  async delete(id: User['id']): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async switchUserState(id: User['id']): Promise<void> {
    const user = await this.findOne(id);
    user.isActive = false;
    await this.userRepository.save(user);
  }

  async assignPlanToUser(userId: number, planId: Plan['id']): Promise<User> {
    const plan = await this.plansService.findPlan(planId);
    if (!plan) {
      throw new NotFoundException(`The plan doesn't exists.`);
    }

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException(`User not found`);
    if (user.plan?.id == plan.id)
      throw new ConflictException(
        'The user already has assigned this type of plan',
      );

    user.plan = plan;

    return await this.userRepository.save(user);
  }
}
