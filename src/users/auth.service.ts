import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signUp(email: string, password: string) {
    const users = await this.usersService.find(email);
    if (users.length) throw new BadRequestException('Email in user');

    // Generate Salt
    const salt = randomBytes(8).toString('hex');

    // Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hashed result and the salt together
    const resultPassword = `${salt}.${hash}`;

    // Create a new User and save it
    return await this.usersService.createUser(resultPassword, email);
  }

  signIn() {}
}
