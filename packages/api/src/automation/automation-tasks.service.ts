import { Injectable } from '@nestjs/common';
import {
  ProductCalculationsRequest,
  UploadProductCalculationsRequest,
} from '@pcpartdb/shared';
import * as fsPromises from 'fs/promises';
import { ProductService } from '../product/product.service';
import { Context } from '../shared/context';
import * as fileUtils from '../shared/utils';

@Injectable()
export class AutomationTasksService {
  constructor(private productService: ProductService) {}

  async uploadProductCalculations(
    request: UploadProductCalculationsRequest,
    ctx: Context,
  ) {
    const productType = request.productType;
    const calculationsPath = fileUtils.uploadsPath(request.tempPath);

    const calculations: ProductCalculationsRequest[] = JSON.parse(
      await fsPromises.readFile(calculationsPath, 'utf-8'),
    );
    await fileUtils.remove(calculationsPath);

    await this.productService.applyCalculations(
      { productType, calculations },
      ctx,
    );
  }
}
