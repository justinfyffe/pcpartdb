import { Injectable } from '@nestjs/common';
import { mapToProductUpdateEntity } from '@pcpartdb/database';
import {
  CreateProductUpdateRequest,
  ProductType,
  ProductUpdateStatus,
} from '@pcpartdb/shared';
import { Context } from '../shared/context';
import { ProductUpdateRepository } from './product-update.repository';

@Injectable()
export class ProductUpdateService {
  constructor(private repository: ProductUpdateRepository) {}

  async create(request: CreateProductUpdateRequest, ctx: Context) {
    const entity = await mapToProductUpdateEntity(request);

    // Can only have one pending update
    if (request.status === ProductUpdateStatus.Pending) {
      const existingPendingUpdates = await this.repository.findPending(
        {
          productType: entity.productType as ProductType,
          productCompany: entity.productCompany,
          productName: entity.productName,
        },
        ctx,
      );

      // Reject existing pending updates
      for (const update of existingPendingUpdates) {
        await this.repository.reject(update.id, ctx);
      }
    }

    await this.repository.create(entity, ctx);
  }
}
