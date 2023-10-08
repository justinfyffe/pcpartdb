import {
  DEFAULT_LIST_GPUS_LIMIT,
  DEFAULT_LIST_GPUS_OFFSET,
  generateListGpusQueryFromPath,
  getAdminListGpusPath,
  GpuProduct,
  ListGpusQuery,
  ProductType,
} from '@pcpartdb/shared';
import { useRouter } from 'next/router';
import { ProductAutocomplete } from 'packages/website/src/client/product/components/ProductAutocomplete/ProductAutocomplete';
import { productService } from 'packages/website/src/client/product/services/productService';
import { InfoAlert } from 'packages/website/src/client/shared/components/Alert/InfoAlert';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { GpuPagination } from '../GpuPagination';
import { GpuTable } from '../GpuTable';

interface RetailModelsTabProps {}

export const RetailModelsTab: FunctionComponent<RetailModelsTabProps> = () => {
  const router = useRouter();
  const offset = Number(router.query.offset || DEFAULT_LIST_GPUS_OFFSET);
  const limit = Number(router.query.limit || DEFAULT_LIST_GPUS_LIMIT);

  const [retailModels, setRetailModels] = useState<GpuProduct[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [query, setQuery] = useState<ListGpusQuery>({
    filter: { isRetailModel: true },
    pagination: { offset, limit },
  });

  const [_loading, setLoading] = useState(false);

  const fetchChipsets = useCallback(async (q: ListGpusQuery) => {
    setLoading(true);
    const response = await productService.list(ProductType.Gpu, q);
    setRetailModels(response.results as GpuProduct[]);
    setTotalResults(response.total);
    setQuery(q);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchChipsets(query);
  }, [fetchChipsets, query]);

  useEffect(() => {
    router.beforePopState((cb) => {
      fetchChipsets(generateListGpusQueryFromPath(cb.as));
      return true;
    });
  }, [fetchChipsets, router]);

  const handlePageClick = useCallback(
    (query: ListGpusQuery) => {
      setQuery(query);
      const url = getAdminListGpusPath(query);
      router.push(url, undefined, { shallow: true });
    },
    [router],
  );

  const handleChipsetChange = useCallback(
    (chipsetId: number) => {
      const q: ListGpusQuery = {
        ...query,
        filter: {
          ...query.filter,
          chipsetId: chipsetId != null ? chipsetId : undefined,
        },
      };
      setQuery(q);
    },
    [query],
  );

  return (
    <section className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <span>Filter by Chipset:</span>
        <ProductAutocomplete
          productType={ProductType.Gpu}
          onChange={handleChipsetChange}
        />
      </div>

      {retailModels.length > 0 && (
        <>
          <GpuTable gpus={retailModels} />
          <GpuPagination
            query={query}
            totalGpus={totalResults}
            onPageClick={handlePageClick}
          />
        </>
      )}

      {retailModels.length === 0 && (
        <InfoAlert>There are no chipsets.</InfoAlert>
      )}
    </section>
  );
};
