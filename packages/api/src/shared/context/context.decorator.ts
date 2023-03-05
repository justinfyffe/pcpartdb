import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ApiRequest } from '../http';

export const Ctx = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest() as ApiRequest;
  return request.context;
});
