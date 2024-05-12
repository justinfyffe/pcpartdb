import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as uuid from 'uuid';
import { Context } from '../context';

@Injectable()
export class TimerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const ctx: Context = request.context;
    const urlPath = request.originalUrl;
    const startTime = performance.now();
    return next.handle().pipe(
      tap(() => {
        const endTime = performance.now();
        const ms = endTime - startTime;
        console.log(
          `[ ${ctx.uuid} ][ ${ms.toFixed(2)}ms ][ ${ctx.queryCounter(
            false,
          )} queries ][ ${urlPath} ]`,
        );
      }),
    );
  }
}
