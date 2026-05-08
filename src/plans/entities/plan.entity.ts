import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TYPES {
  GOLD = 'gold',
  SILVER = 'silver',
  BRONZE = 'bronze',
}

@Entity('plans')
export class Plan {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ enum: TYPES, unique: true })
  type!: TYPES;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.plan)
  @JoinTable({ name: 'user_id' })
  users!: User[];
}
