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

@Controller('user')
@Serialize(UserDto)
export class UsersController {
  constructor(private usersServices: UsersService) {}
  @Post('/signup')
  async createUser(@Body() { password, email }: CreateUserDto) {
    await this.usersServices.createUser(password, email);
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersServices.findUser(Number(id));
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
  @Get()
  async findAllUsers(@Query('email') email: string) {
    return this.usersServices.find(email);
  }
  @Delete()
  async deleteUser(@Param('id') id: string) {
    await this.usersServices.remove(Number(id));
  }
  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return await this.usersServices.update(Number(id), body);
  }
}
