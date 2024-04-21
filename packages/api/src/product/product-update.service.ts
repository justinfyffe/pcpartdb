import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  mapToProductUpdateDto,
  mapToProductUpdateDtos,
  mapToProductUpdateEntity,
} from '@pcpartdb/database';
import {
  ApproveProductUpdateRequest,
  approveProductUpdateRequestSchema,
  CreateProductUpdateRequest,
  createProductUpdateRequestSchema,
  ListProductUpdatesRequest,
  listProductUpdatesRequestSchema,
  ListProductUpdatesResponse,
  ProductUpdateStatus,
  RejectProductUpdateRequest,
  rejectProductUpdateRequestSchema,
  ValidationErrorType,
} from '@pcpartdb/shared';
import { Context } from '../shared/context';
import { badRequestError, notFoundError } from '../shared/error';
import { validate } from '../shared/validation/validate';
import { ProductService } from './product.service';
import { ProductUpdateRepository } from './repositories';

interface FindByProductIdOptions {
  productId: number;
}

@Injectable()
export class ProductUpdateService {
  constructor(
    private repository: ProductUpdateRepository,
    @Inject(forwardRef(() => ProductService))
    private productService: ProductService,
  ) {}

  /**
   * Returns a list of product updates that match the filter.
   */
  async list(request: ListProductUpdatesRequest, ctx: Context) {
    validate(request, listProductUpdatesRequestSchema);
    const { query } = request;

    const { results, total } = await this.repository.list({ query }, ctx);

    return {
      query,
      results: await mapToProductUpdateDtos(results),
      total,
    } as ListProductUpdatesResponse;
  }

  /**
   * Finds a pending product update for the given product id.
   */
  async findPendingByProductId(options: FindByProductIdOptions, ctx: Context) {
    const entity = await this.repository.findPendingByProductId(options, ctx);
    if (entity[0] == null) {
      return null;
    }

    return await mapToProductUpdateDto(entity[0]);
  }

  /**
   * Creates a product update
   */
  async create(request: CreateProductUpdateRequest, ctx: Context) {
    validate(request, createProductUpdateRequestSchema);

    const entity = await mapToProductUpdateEntity(request);

    // Reject existing pending update (if exists)
    if (request.status === ProductUpdateStatus.Pending && entity.productId) {
      const pendingUpdate = await this.findPendingByProductId(
        { productId: entity.productId },
        ctx,
      );
      if (pendingUpdate) {
        await this.reject(pendingUpdate.id, {}, ctx);
      }
    }

    await this.repository.create(entity, ctx);
  }

  /**
   * Approve the pending update. Apply it to the product.
   */
  async approve(
    id: number,
    request: ApproveProductUpdateRequest,
    ctx: Context,
  ) {
    validate(request, approveProductUpdateRequestSchema);

    const entity = await this.repository.findById(id, ctx);
    if (entity == null) {
      throw notFoundError({ id });
    }
    const update = await mapToProductUpdateDto(entity);

    if (update.status !== ProductUpdateStatus.Pending) {
      // Cannot approve a pending update
      throw badRequestError({
        property: 'id',
        constraint: ValidationErrorType.NotPendingProductUpdate,
      });
    }

    await this.productService.applyProductUpdate(update, request, ctx);

    await this.repository.update(
      id,
      { status: ProductUpdateStatus.Approved },
      ctx,
    );
  }

  /**
   * Reject the pending update.
   */
  async reject(id: number, request: RejectProductUpdateRequest, ctx: Context) {
    validate(request, rejectProductUpdateRequestSchema);
    const entity = await this.repository.findById(id, ctx);
    if (entity == null) {
      throw notFoundError({ id });
    }

    if (entity.status !== ProductUpdateStatus.Pending) {
      // Cannot approve a pending update
      throw badRequestError({
        property: 'id',
        constraint: ValidationErrorType.NotPendingProductUpdate,
      });
    }

    await this.repository.update(
      id,
      { status: ProductUpdateStatus.Rejected },
      ctx,
    );
  }
}
