import { Injectable } from '@nestjs/common';
import { ImageRepository as BaseImageRepository } from '@pcpartdb/database';
import { Database } from '../database';

@Injectable()
export class ImageRepository extends BaseImageRepository {
  constructor(db: Database) {
    super(db);
  }
}
