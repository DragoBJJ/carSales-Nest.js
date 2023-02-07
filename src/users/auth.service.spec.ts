import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserEntity } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: UserEntity[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      createUser: (password, email) => {
        const user = { id: users.length, email, password } as UserEntity;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  it('Can create an instance of auth service', async () => {
    // Create a fake copy of the users service

    expect(service).toBeDefined();
  });

  it('Creates a new user with a salted and hashed password', async () => {
    const user = await service.signUp('asdas@gmail.com', 'asdasd');
    expect(user.password).not.toEqual('asdasd');
    const [salt, password] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(password).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signUp('asdf@asdf.com', 'asdf');
    await expect(service.signUp('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });
  it('Throws if signIn is called with an unused email', async () => {
    await expect(
      service.signIn('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });

  it('Throws if a invalid password is provided', async () => {
    await service.signUp('laskdjf@alskdfj.com', 'password');
    await expect(
      service.signUp('laskdjf@alskdfj.com', 'laksdlfkj'),
    ).rejects.toThrow(BadRequestException);
  });

  it('Returns a user if correct password is provided', async () => {
    await service.signUp('Jakub@gmail@gmail.com', 'mypassword');
    const user = await service.signIn('Jakub@gmail@gmail.com', 'mypassword');
    expect(user).toBeDefined();
  });
});

// it('throws if an invalid password is provided', async () => {
//     fakeUsersService.find = () =>
//       Promise.resolve([
//         { email: 'asdf@asdf.com', password: 'laskdjf' } as User,
//       ]);
//     await expect(
//       service.signin('laskdjf@alskdfj.com', 'passowrd'),
//     ).rejects.toThrow(BadRequestException);
//   });
