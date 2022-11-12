import { ApiContext } from '@server/shared/api/context';
import { controller, staffController } from '@server/shared/api/controller';
import type {
  ImportProductRequest,
  ProductRequest,
  ProductType,
} from '@shared/product';
import { ProductMetas } from '@shared/product-meta';
import { Specs } from '@shared/spec';
import { productImporterService } from './product-importer-service';
import { productService } from './product-service';

export const autocompleteProducts = controller(async (ctx: ApiContext) => {
  const type = ctx.req.query['type'] as ProductType;
  const query = ctx.req.query['query'] as string;
  return await productService.autocomplete(type, query ?? '', ctx);
});

export const autocompleteSpecs = staffController(async (ctx: ApiContext) => {
  const key = ctx.req.query['key'] as keyof Specs;
  const query = ctx.req.query['value'] as string;
  return await productService.autocompleteSpec(key, query ?? '', ctx);
});

export const autocompleteProductMetas = staffController(
  async (ctx: ApiContext) => {
    const key = ctx.req.query['key'] as keyof ProductMetas;
    const query = ctx.req.query['value'] as string;
    return await productService.autocompleteMeta(key, query ?? '', ctx);
  },
);

export const listProducts = controller(async (ctx: ApiContext) => {
  const type = ctx.req.query['type'] as ProductType;
  return await productService.list({ type }, ctx);
});

export const getProduct = controller(async (ctx: ApiContext) => {
  const idOrSlug = ctx.req.query['id'] as string;
  return await productService.get(idOrSlug, ctx);
});

export const getProductComparison = controller(async (ctx: ApiContext) => {
  const idsOrSlugs = ctx.req.query['id'] as string;
  return await productService.getComparison(idsOrSlugs, ctx);
});

export const createProduct = staffController(async (ctx: ApiContext) => {
  const body = ctx.req.body as ProductRequest;
  return await productService.create(body, ctx);
});

export const updateProduct = staffController(async (ctx: ApiContext) => {
  const id = Number(ctx.req.query['id'] as string);
  const body = ctx.req.body as ProductRequest;
  return await productService.update(id, body, ctx);
});

export const deleteProduct = staffController(async (ctx: ApiContext) => {
  const id = Number(ctx.req.query['id'] as string);
  return await productService.delete(id, ctx);
});

export const importProduct = staffController(async (ctx: ApiContext) => {
  const body = ctx.req.body as ImportProductRequest;
  return productImporterService.import(body);
});
