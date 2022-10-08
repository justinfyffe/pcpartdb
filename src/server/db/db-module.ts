import { DynamicModule, Global, Module } from '@nestjs/common';
import { openDatabase } from './database';

export const DATABASE = 'DATABASE';

@Global()
@Module({})
export class DbModule {
  static register(): DynamicModule {
    const db = openDatabase();

    return {
      module: DbModule,
      providers: [
        {
          provide: DATABASE,
          useValue: db,
        },
      ],
    };
  }
}
