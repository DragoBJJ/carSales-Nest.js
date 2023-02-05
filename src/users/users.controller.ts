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
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from '../dto/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorator/current-user.decorator';
import { UserEntity } from './user.entity';
import { AuthGuard } from '../guard/auth.guard';

@Controller('user')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: UserEntity) {
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userID = null;
  }

  @Post('/signup')
  async createUser(
    @Body() { email, password }: CreateUserDto,
    @Session() session: any,
  ) {
    const user = await this.authService.signUp(email, password);
    session.userID = user.id;
    return user;
  }

  @Post('/signin')
  async signIn(
    @Body() { email, password }: CreateUserDto,
    @Session() session: any,
  ) {
    const user = await this.authService.signIn(email, password);
    session.userID = user.id;
    return user;
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
