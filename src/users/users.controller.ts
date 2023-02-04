import {Controller, Post,Body} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {UsersService} from "./users.service";

@Controller('user')
export class UsersController {
    constructor(private usersServices: UsersService) {}
    @Post("/signup")
    async createUser(@Body() {password,email}: CreateUserDto) {
        await this.usersServices.createUser(password, email)
    }

}
