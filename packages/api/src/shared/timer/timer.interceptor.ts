import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as uuid from 'uuid';

@Injectable()
export class TimerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const urlPath = context.switchToHttp().getRequest().originalUrl;
    const timer = `${urlPath} (${uuid.v4()})`;
    console.time(timer);
    return next.handle().pipe(tap(() => console.timeEnd(timer)));
  }
}
