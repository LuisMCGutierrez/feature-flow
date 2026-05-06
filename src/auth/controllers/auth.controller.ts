import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login-dto';
import { UsersService } from 'src/users/services/users.service';
import { CreateUserDto } from 'src/users/dtos/create-user-dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: LoginDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  create(@Body() payload: CreateUserDto) {
    return this.usersService.create(payload);
  }
}
