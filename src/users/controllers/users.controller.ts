import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user-dto';
import { UpdateUserDto } from '../dtos/update-user-dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param(':id') id: User['id']) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param(':id') id: User['id'], @Body() payload: UpdateUserDto) {
    return this.usersService.update(id, payload);
  }

  @Delete(':id')
  delete(@Param(':id') id: User['id']) {
    this.usersService.delete(id);
  }
}
