import { Exclude } from 'class-transformer';
import { Plan } from 'src/plans/entities/plan.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinTable,
} from 'typeorm';

export enum ROLE {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column({ name: 'first_name' })
  firstName!: string;

  @Column({ name: 'last_name' })
  lastName!: string;

  @Column({ select: false })
  @Exclude()
  password!: string;

  @Column({ enum: ROLE, default: ROLE.USER })
  role!: ROLE;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => Plan, (plan) => plan.users)
  @JoinTable({ name: 'plan_id' })
  plan!: Plan;
}
