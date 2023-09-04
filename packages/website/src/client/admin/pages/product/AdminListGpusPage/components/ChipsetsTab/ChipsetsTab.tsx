import {
  DEFAULT_LIST_GPUS_LIMIT,
  DEFAULT_LIST_GPUS_OFFSET,
  generateListGpusQueryFromPath,
  getAdminListGpusPath,
  Gpu,
  ListGpusQuery,
} from '@pcpartdb/shared';
import { useRouter } from 'next/router';
import { gpuService } from 'packages/website/src/client/product';
import { InfoAlert } from 'packages/website/src/client/shared/components/Alert/InfoAlert';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { GpuPagination } from '../GpuPagination';
import { GpuTable } from '../GpuTable';

interface ChipsetsTabProps {}

export const ChipsetsTab: FunctionComponent<ChipsetsTabProps> = () => {
  const router = useRouter();
  const offset = Number(router.query.offset || DEFAULT_LIST_GPUS_OFFSET);
  const limit = Number(router.query.limit || DEFAULT_LIST_GPUS_LIMIT);

  const [chipsets, setChipsets] = useState<Gpu[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [query, setQuery] = useState<ListGpusQuery>({
    filter: { isChipset: true },
    pagination: { offset, limit },
  });

  const [_loading, setLoading] = useState(false);

  const fetchChipsets = useCallback(async (q: ListGpusQuery) => {
    setLoading(true);
    const response = await gpuService.list(q);
    setChipsets(response.gpus);
    setTotalResults(response.totalGpus);
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

  return (
    <section>
      {chipsets.length > 0 && (
        <>
          <GpuTable gpus={chipsets} />
          <GpuPagination
            query={query}
            totalGpus={totalResults}
            onPageClick={handlePageClick}
          />
        </>
      )}

      {chipsets.length === 0 && <InfoAlert>There are no chipsets.</InfoAlert>}
    </section>
  );
};
