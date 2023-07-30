import { Injectable } from '@nestjs/common';
import {
  mapToProductUpdateDto,
  mapToProductUpdateDtos,
  mapToProductUpdateEntity,
} from '@pcpartdb/database';
import {
  ApproveProductUpdateRequest,
  CreateProductUpdateRequest,
  ListProductUpdatesRequest,
  ListProductUpdatesResponse,
  ProductType,
  ProductUpdateStatus,
  RejectProductUpdateRequest,
  ValidationErrorType,
} from '@pcpartdb/shared';
import { Context } from '../shared/context';
import { badRequestError, notFoundError } from '../shared/error';
import { validate } from '../shared/validation/validate';
import { CpuService } from './cpu/cpu.service';
import { GpuService } from './gpu/gpu.service';
import {
  approveProductUpdateRequestValidator,
  createProductUpdateRequestValidator,
  listProductUpdatesRequestValidator,
  rejectProductUpdateRequestValidator,
} from './product.validators';
import { ProductUpdateRepository } from './product-update.repository';

@Injectable()
export class ProductUpdateService {
  constructor(
    private repository: ProductUpdateRepository,
    private cpuService: CpuService,
    private gpuService: GpuService,
  ) {}

  /**
   * Returns a list of product updates that match the filter.
   */
  async list(request: ListProductUpdatesRequest, ctx: Context) {
    validate(request, listProductUpdatesRequestValidator);
    const { query } = request;

    const { results, total } = await this.repository.list({ query }, ctx);

    return {
      query,
      results: await mapToProductUpdateDtos(results),
      total,
    } as ListProductUpdatesResponse;
  }

  /**
   * Creates a product update
   */
  async create(request: CreateProductUpdateRequest, ctx: Context) {
    validate(request, createProductUpdateRequestValidator);

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
        await this.repository.update(
          update.id,
          { status: ProductUpdateStatus.Rejected },
          ctx,
        );
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
    validate(request, approveProductUpdateRequestValidator);

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

    if (update.productType == ProductType.Cpu) {
      await this.cpuService.applyProductUpdate(update, request, ctx);
    } else if (update.productType === ProductType.Gpu) {
      //
    } else {
      throw badRequestError({
        property: 'id',
        constraint: ValidationErrorType.MissingProductType,
      });
    }

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
    validate(request, rejectProductUpdateRequestValidator);
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
