import { NestMiddleware, Injectable } from '@nestjs/common';
import { UserEntity } from '../users/user.entity';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from '../users/users.service';

type ReqType = {
  currentUser?: UserEntity;
} & Request;

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private userService: UsersService) {}
  async use(req: ReqType, res: Response, next: NextFunction) {
    const { userID } = req.session || {};
    if (userID) {
      req.currentUser = await this.userService.findUser(parseInt(userID));
      console.log(' req.currentUser', req.currentUser);
    }
    next();
  }
}
