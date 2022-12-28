import { ProductsQuery } from '@shared/product';

export function generateListUrl(query: ProductsQuery) {
  const params = new URLSearchParams();

  if (query.filter?.company?.length > 0) {
    params.append('company', query.filter.company.join(','));
  }

  if (query.orderBy?.sort) {
    params.append('sort', query.orderBy.sort);
  }

  if (query.orderBy?.order) {
    params.append('order', query.orderBy.order);
  }

  const q = params.toString();
  return q ? `/gpus?${q}` : '/gpus';
}
