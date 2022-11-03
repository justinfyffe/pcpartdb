import { transaction } from '@server/db/database';
import { serializeAsync } from '@server/shared/types/serialize';
import type { ProductRequest, ProductType } from '@shared/product';
import { NextApiRequest, NextApiResponse } from 'next';
import { productService } from './product-service';

export class ProductController {
  async autocomplete(req: NextApiRequest, res: NextApiResponse) {
    return transaction(async (trx) => {
      const type = req.query['type'] as ProductType;
      const query = req.query['query'] as string;

      const products = await serializeAsync(
        productService.autocomplete(type, query ?? '', {
          trx,
          api: { req, res },
        }),
      );

      res.status(200).json(products);
    });
  }

  async list(req: NextApiRequest, res: NextApiResponse) {
    return transaction(async (trx) => {
      const type = req.query['type'] as ProductType;

      const products = await serializeAsync(
        productService.list(type, { trx, api: { req, res } }),
      );

      res.status(200).json(products);
    });
  }

  async get(req: NextApiRequest, res: NextApiResponse) {
    return transaction(async (trx) => {
      const idOrSlug = req.query['id'] as string;

      const product = await serializeAsync(
        productService.get(idOrSlug, { trx, api: { req, res } }),
      );

      res.status(200).json(product);
    });
  }

  async getComparison(req: NextApiRequest, res: NextApiResponse) {
    return transaction(async (trx) => {
      const idsOrSlugs = req.query['id'] as string;

      const comparison = await serializeAsync(
        productService.getComparison(idsOrSlugs, { trx }),
      );

      res.status(200).json(comparison);
    });
  }

  // TODO: handle guards
  async create(req: NextApiRequest, res: NextApiResponse) {
    return transaction(async (trx) => {
      const body = req.body as ProductRequest;

      const product = await serializeAsync(
        productService.create(body, { trx, api: { req, res } }),
      );

      res.status(200).json(product);
    });
  }

  // TODO: handle guards
  async update(req: NextApiRequest, res: NextApiResponse) {
    return transaction(async (trx) => {
      const id = Number(req.query['id'] as string);
      const body = req.body as ProductRequest;

      const product = await serializeAsync(
        productService.update(id, body, { trx, api: { req, res } }),
      );

      res.status(200).json(product);
    });
  }

  // TODO: handle guards
  async delete(req: NextApiRequest, res: NextApiResponse) {
    return transaction(async (trx) => {
      const id = Number(req.query['id'] as string);

      const deleted = productService.delete(id, { trx, api: { req, res } });

      res.status(200).json(deleted);
    });
  }
}

export const productController = new ProductController();
