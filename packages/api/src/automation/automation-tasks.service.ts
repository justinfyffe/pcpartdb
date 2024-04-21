import { Injectable } from '@nestjs/common';
import {
  UpdateProductRanksRequest,
  UpdateRelatedProductsRequest,
  UploadProductRanksRequest,
  UploadRelatedProductsRequest,
} from '@pcpartdb/shared';
import * as fsPromises from 'fs/promises';
import { Database } from '../database';
import { ProductRepository } from '../product/repositories';
import { Context } from '../shared/context';
import * as fileUtils from '../shared/utils';

@Injectable()
export class AutomationTasksService {
  constructor(
    private db: Database,
    private productRepository: ProductRepository,
  ) {}

  async uploadProductRanks(request: UploadProductRanksRequest, ctx: Context) {
    return await this.db.transaction(
      async () => {
        const path = fileUtils.uploadsPath(request.tempPath);

        const updateRequest: UpdateProductRanksRequest = JSON.parse(
          await fsPromises.readFile(path, 'utf-8'),
        );
        await fileUtils.remove(path);

        await this.productRepository.applyRanks(updateRequest, ctx);
      },
      { ctx, timeout: 180_000 },
    );
  }

  async uploadRelatedProducts(
    request: UploadRelatedProductsRequest,
    ctx: Context,
  ) {
    return await this.db.transaction(
      async () => {
        const path = fileUtils.uploadsPath(request.tempPath);

        const updateRequest: UpdateRelatedProductsRequest = JSON.parse(
          await fsPromises.readFile(path, 'utf-8'),
        );
        await fileUtils.remove(path);

        await this.productRepository.applyRelatedProducts(updateRequest, ctx);
      },
      { ctx, timeout: 180_000 },
    );
  }
}
