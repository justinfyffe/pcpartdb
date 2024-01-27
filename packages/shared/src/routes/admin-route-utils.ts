import {
  DEFAULT_LIST_PRODUCTS_LIMIT,
  DEFAULT_LIST_PRODUCTS_OFFSET,
  ListProductsQuery,
  Product,
  ProductType,
} from '../product';
import { joinUrlParts } from '../utils';

export function getAdminOverviewPath() {
  return '/admin/';
}

export function getAdminAutomationPath() {
  return '/admin/automation/';
}

export function getAdminListProductsPath(query?: ListProductsQuery) {
  const path = '/admin/products/';

  const paginationParams =
    query != null
      ? Object.fromEntries(generatePaginationParamsFromProductsQuery(query))
      : {};
  const searchParams =
    query != null
      ? Object.fromEntries(generateSearchParamsFromProductsQuery(query))
      : {};

  const combinedParams = new URLSearchParams({
    ...paginationParams,
    ...searchParams,
  }).toString();

  return joinUrlParts(path, combinedParams ? `?${combinedParams}` : '');
}

function generatePaginationParamsFromProductsQuery(query: ListProductsQuery) {
  const params = new URLSearchParams();

  if (
    query?.pagination?.limit != null &&
    query.pagination.limit !== DEFAULT_LIST_PRODUCTS_LIMIT
  ) {
    params.append('limit', `${query.pagination.limit}`);
  }

  if (
    query?.pagination?.offset != null &&
    query.pagination.offset !== DEFAULT_LIST_PRODUCTS_OFFSET
  ) {
    params.append('offset', `${query.pagination.offset}`);
  }

  return params;
}

function generateSearchParamsFromProductsQuery(query: ListProductsQuery) {
  const params = new URLSearchParams();

  if (query.filter?.productType) {
    params.append('type', query.filter.productType.toLowerCase());
  }

  if (query.filter?.search) {
    params.append('search', query.filter.search);
  }

  if (query.orderBy?.sort) {
    params.append('sort', query.orderBy.sort);
  }

  if (query.orderBy?.order) {
    params.append('order', query.orderBy.order);
  }

  return params;
}

interface GetAdminNewProductPath {
  productType?: ProductType;
}

export function getAdminNewProductPath(options?: GetAdminNewProductPath) {
  if (options?.productType != null) {
    return `/admin/products/new/?type=${options.productType.toLowerCase()}`;
  }
  return '/admin/products/new/';
}

export interface GetAdminEditProductPathOptions {
  product?: Product;

  id?: number;

  productType?: ProductType;
  slug?: string;
}

export function getAdminEditProductPath(
  options: GetAdminEditProductPathOptions,
) {
  if (options.id != null) {
    return joinUrlParts('/admin/products/', String(options.id), '/');
  } else if (options.productType != null && options.slug != null) {
    return joinUrlParts(
      '/admin/products/',
      options.slug,
      '/',
      `?type=${options.productType.toLowerCase()}`,
    );
  } else if (options.product != null) {
    return joinUrlParts('/admin/products/', String(options.product.id), '/');
  } else {
    throw new Error(
      `Invalid options for getAdminEditProductPath: ${JSON.stringify(options)}`,
    );
  }
}

export function getAdminListBuildsPath() {
  return '/admin/builds/';
}
