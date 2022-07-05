import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class StaffGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return user != null && user.isStaff;
  }
}
