import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { of, tap } from 'rxjs';
import { Context } from '../context';
import { CacheService, CacheType } from './cache.service';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(private cacheService: CacheService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest() as Request & {
      context: Context;
    };
    const checkCache = process.env.ENABLE_PAGE_CACHE === 'true';
    if (!checkCache || request.context?.user?.isStaff) {
      return next.handle();
    }

    const url = request.url;
    const cachedData = await this.cacheService.getCached({
      type: CacheType.Page,
      key: url,
    });

    if (cachedData != null) {
      return of(cachedData);
    }

    return next
      .handle()
      .pipe(
        tap((data) =>
          this.cacheService.setCached(data, { type: CacheType.Page, key: url }),
        ),
      );
  }
}
