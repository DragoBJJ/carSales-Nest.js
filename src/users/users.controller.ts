import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Delete,
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from '../dto/user.dto';
import { AuthService } from './auth.service';

@Controller('user')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}
  @Post('/signup')
  async createUser(@Body() { email, password }: CreateUserDto) {
    return this.authService.signUp(email, password);
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findUser(Number(id));
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
  @Get()
  async findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }
  @Delete()
  async deleteUser(@Param('id') id: string) {
    await this.usersService.remove(Number(id));
  }
  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return await this.usersService.update(Number(id), body);
  }
}
