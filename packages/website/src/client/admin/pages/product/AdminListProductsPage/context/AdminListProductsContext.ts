import {
  DEFAULT_LIST_PRODUCTS_LIMIT,
  DEFAULT_LIST_PRODUCTS_OFFSET,
  generateListProductsQueryFromPath,
  getAdminListProductsPath,
  ListOrder,
  ListProductsQuery,
  ListSort,
  Product,
  ProductType,
} from '@pcpartdb/shared';
import { useRouter } from 'next/router';
import { productService } from 'packages/website/src/client/product/services/productService';
import { RequestConfig } from 'packages/website/src/client/shared/api/types';
import { useCancelable } from 'packages/website/src/client/shared/hooks/useCancelable';
import { useThrottle } from 'packages/website/src/client/shared/hooks/useThrottle';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface AdminListProductsContextState {
  products: Product[];
  totalProducts: number;
  loading: boolean;
  query: ListProductsQuery;
  updateQuery: (query: ListProductsQuery) => void | Promise<void>;
}

export const AdminListProductsContext =
  createContext<AdminListProductsContextState>({
    products: [],
    totalProducts: 0,
    loading: false,
    query: null,
    updateQuery: null,
  });

export function useAdminListProductsContextBuilder() {
  const router = useRouter();
  const offset = Number(router.query.offset || DEFAULT_LIST_PRODUCTS_OFFSET);
  const limit = Number(router.query.limit || DEFAULT_LIST_PRODUCTS_LIMIT);
  const defaultSort = (router.query.sort as ListSort) ?? ListSort.Id;
  const defaultOrder = (router.query.order as ListOrder) ?? ListOrder.Asc;
  const initialProductType =
    ((router.query.type as string)?.toUpperCase() as ProductType) ||
    ProductType.Gpu;
  const initialSearch = router.query.search as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [query, setQuery] = useState<ListProductsQuery>({
    filter: { productType: initialProductType, search: initialSearch },
    pagination: { offset, limit },
    orderBy: { sort: defaultSort, order: defaultOrder },
  });

  const [loading, setLoading] = useState(false);

  const fetchProductsImpl = useCallback(
    async (query: ListProductsQuery, requestConfig?: RequestConfig) => {
      setLoading(true);
      const response = await productService.list(query, requestConfig);
      if (requestConfig?.signal == null || !requestConfig.signal.aborted) {
        setProducts(response.results as Product[]);
        setTotalProducts(response.total);
        setQuery(response.query);
        setLoading(false);
      }
    },
    [],
  );
  const { func: fetchProducts, abort: abortFetchProducts } = useCancelable(
    useThrottle(fetchProductsImpl, 250),
  );

  useEffect(() => {
    router.beforePopState((cb) => {
      abortFetchProducts?.();
      fetchProducts(
        generateListProductsQueryFromPath({
          productType: query.filter.productType,
          path: cb.as,
          defaults: {
            sort: defaultSort,
            order: defaultOrder,
          },
        }),
      );
      return true;
    });
  }, [
    abortFetchProducts,
    defaultOrder,
    defaultSort,
    fetchProducts,
    fetchProductsImpl,
    initialProductType,
    query.filter.productType,
    router,
  ]);

  const updateQuery = useCallback(
    async (query: ListProductsQuery) => {
      abortFetchProducts?.();
      await fetchProducts(query);

      const url = getAdminListProductsPath(query);
      router.push(url, undefined, { shallow: true });
    },
    [abortFetchProducts, fetchProducts, router],
  );

  const context = useMemo(() => {
    return {
      products,
      totalProducts,
      loading,
      query,
      updateQuery,
    } as AdminListProductsContextState;
  }, [products, totalProducts, loading, query, updateQuery]);

  // Fetch products for the first time.
  // Should not be throttable or cancelable
  useEffect(() => {
    fetchProductsImpl(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return context;
}
