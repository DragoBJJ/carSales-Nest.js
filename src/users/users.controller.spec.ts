import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UserEntity } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      find(email: string): Promise<UserEntity[]> {
        return Promise.resolve([
          {
            id: 1,
            email,
            password: 'asdasd',
          },
        ]);
      },
      findUser(id: number): Promise<UserEntity> {
        return Promise.resolve({
          id,
          email: 'asdasd@gmail.com',
          password: 'asdasd',
        });
      },
      async remove(id: number): Promise<UserEntity> {
        return Promise.resolve({
          id,
          email: 'asdasd@gmail.com',
          password: 'asdasd',
        });
      },
      async update(id: number, body: Partial<UserEntity>): Promise<UserEntity> {
        return Promise.resolve({
          id,
          email: body.email,
          password: body.password,
        });
      },
    };
    fakeAuthService = {
      // async signUp(email: string, password: string) {},
      async signIn(email: string, password: string) {
        return Promise.resolve({
          id: 5,
          email,
          password,
        });
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();
    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('FindAll users returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('ada@gmail.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('ada@gmail.com');
  });
  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findUser = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('SignIn updates session object and returns user', async () => {
    const session = { userID: -10 };
    const user = await controller.signIn(
      {
        email: 'asd@gmail.com',
        password: 'asd',
      },
      session,
    );
    expect(user.id).toEqual(5);
    expect(session.userID).toEqual(5);
  });
});
