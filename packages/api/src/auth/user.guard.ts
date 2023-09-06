import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ApiRequest } from '../shared/http/types';

@Injectable()
export class UserGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request: ApiRequest = context.switchToHttp().getRequest();
    const user = request.context?.user;
    return user != null;
  }
}
