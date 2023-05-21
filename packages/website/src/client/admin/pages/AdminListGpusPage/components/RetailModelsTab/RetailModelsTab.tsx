import {
  DEFAULT_LIST_GPUS_LIMIT,
  DEFAULT_LIST_GPUS_OFFSET,
  generateGpusQueryFromPath,
  getAdminListGpusPath,
  Gpu,
  ListGpusQuery,
} from '@pcpartdb/shared';
import { useRouter } from 'next/router';
import { GpuAutocomplete } from 'packages/website/src/client/gpus/components';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { gpuService } from '../../../../../gpus';
import { Alert, AlertVariant } from '../../../../../shared/components';
import { GpuPagination } from '../GpuPagination';
import { GpuTable } from '../GpuTable';

interface RetailModelsTabProps {}

export const RetailModelsTab: FunctionComponent<RetailModelsTabProps> = () => {
  const router = useRouter();
  const offset = Number(router.query.offset || DEFAULT_LIST_GPUS_OFFSET);
  const limit = Number(router.query.limit || DEFAULT_LIST_GPUS_LIMIT);

  const [retailModels, setRetailModels] = useState<Gpu[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [query, setQuery] = useState<ListGpusQuery>({
    filter: { isRetailModel: true },
    pagination: { offset, limit },
  });

  const [_loading, setLoading] = useState(false);

  const fetchChipsets = useCallback(async (q: ListGpusQuery) => {
    setLoading(true);
    const response = await gpuService.list(q);
    setRetailModels(response.gpus);
    setTotalResults(response.totalGpus);
    setQuery(q);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchChipsets(query);
  }, [fetchChipsets, query]);

  useEffect(() => {
    router.beforePopState((cb) => {
      fetchChipsets(generateGpusQueryFromPath(cb.as));
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
        filter: { ...query.filter, chipsetId: chipsetId },
      };
      setQuery(q);
    },
    [query],
  );

  return (
    <section className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <span>Filter by Chipset:</span>
        <GpuAutocomplete onChange={handleChipsetChange} />
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
        <Alert variant={AlertVariant.Info}>There are no chipsets.</Alert>
      )}
    </section>
  );
};
