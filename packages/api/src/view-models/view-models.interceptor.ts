import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ViewModel } from '@pcpartdb/shared/view-models';
import { map } from 'rxjs';
import { ApiRequest } from '../shared/http';

@Injectable()
export class ViewModelsInterceptor implements NestInterceptor {
  constructor() {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest() as ApiRequest;
    return next.handle().pipe(
      map((value) => {
        const ctx = request.context;

        return { props: { ...value, ctx: ctx.props } } as ViewModel;
      }),
    );
  }
}
