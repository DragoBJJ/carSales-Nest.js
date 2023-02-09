import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';

import { UsersService } from '../users/users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(ctx: ExecutionContext, handler: CallHandler) {
    const request = ctx.switchToHttp().getRequest();
    const { userID } = request.session || {};
    if (!userID) return handler.handle();
    const user = await this.usersService.findUser(userID);
    if (!user) return handler.handle();
    request.currentUser = user;
    return handler.handle();
  }
}
