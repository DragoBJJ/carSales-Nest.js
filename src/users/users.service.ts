import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}
  createUser(password: string, email: string) {
    const user = this.userRepo.create({
      password,
      email,
    });
    return this.userRepo.save(user);
  }

  findUser(id: number) {
    return this.userRepo.findOne({
      where: { id },
    });
  }

  find(email: string) {
    return this.userRepo.find({ where: { email } });
  }

  async update(id: number, body: Partial<UserEntity>) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    Object.assign(user, body);
    return this.userRepo.save(user);
  }

  async remove(id: number) {
    const user = await this.findUser(id);
    if (!user) throw new NotFoundException('User not found');
    return this.userRepo.remove(user);
  }
}
