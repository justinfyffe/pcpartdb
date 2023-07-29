import 'reflect-metadata';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import {
  CpuUpdate,
  ListProductUpdatesFilter,
  ListProductUpdatesQuery,
  ProductType,
  ProductUpdateStatus,
} from '@pcpartdb/shared';
import { productUpdateService } from 'packages/website/src/client/product/services/productUpdateService';
import { TextInput } from 'packages/website/src/client/shared/components';
import { InfoAlert } from 'packages/website/src/client/shared/components/Alert/InfoAlert';
import { GenericButton } from 'packages/website/src/client/shared/components/Button/GenericButton';
import { Pagination } from 'packages/website/src/client/shared/components/Pagination/Pagination';
import { useDebounce } from 'packages/website/src/client/shared/hooks/useDebounce';
import React, { useCallback, useEffect, useState } from 'react';
import { CpuCard } from './CpuCard';

const LIMIT = 10;
const FILTER_DEBOUNCE = 300;

interface CpusTabProps {}

export const CpusTab = (_props: CpusTabProps) => {
  // States

  const [loading, setLoading] = useState(false);
  const [updates, setUpdates] = useState<CpuUpdate[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState<ListProductUpdatesQuery>({
    filter: {
      productType: ProductType.Cpu,
      status: ProductUpdateStatus.Pending,
    },
    pagination: { offset: 0, limit: LIMIT },
  });

  // Callbacks

  const fetchCpuUpdates = useCallback(async (q: ListProductUpdatesQuery) => {
    setLoading(true);
    const response = await productUpdateService.listUpdates({ query: q });
    setQuery(response.query);
    setUpdates(response.results);
    setTotal(response.total);
    setLoading(false);
  }, []);

  const filterUpdates = useCallback(
    (value: string) => {
      const filter: ListProductUpdatesFilter = {
        ...query.filter,
        search: value || undefined,
      };
      fetchCpuUpdates({ ...query, filter });
    },
    [fetchCpuUpdates, query],
  );
  const debouncedFilterUpdates = useDebounce(filterUpdates, FILTER_DEBOUNCE);

  const refresh = useCallback(() => {
    fetchCpuUpdates({ ...query });
  }, [fetchCpuUpdates, query]);

  const changePage = useCallback(
    (offset: number, limit: number) => {
      const pagination = { offset, limit };
      fetchCpuUpdates({ ...query, pagination });
    },
    [fetchCpuUpdates, query],
  );

  // Effects

  useEffect(() => {
    fetchCpuUpdates(query);
    // Only run this once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-4">
          <div className="flex flex-1 gap-4 max-w-[50%]">
            <TextInput
              placeholder="Search CPUs"
              onChange={debouncedFilterUpdates}
            />
          </div>

          <div className="flex gap-4 items-center">
            {total > 0 && (
              <Pagination
                displayTotal={true}
                offset={query.pagination.offset}
                limit={query.pagination.limit}
                total={total}
                onChange={changePage}
              ></Pagination>
            )}

            <GenericButton onClick={refresh}>
              <ArrowPathIcon className="w-4" />
            </GenericButton>
          </div>
        </div>

        {loading && total === 0 && (
          <InfoAlert>Fetching CPU updates. Please wait.</InfoAlert>
        )}

        {!loading && total === 0 && (
          <InfoAlert>No CPU updates. Try refreshing.</InfoAlert>
        )}

        {updates.map((update) => (
          <CpuCard key={update.id} update={update} />
        ))}
      </div>
    </>
  );
};
