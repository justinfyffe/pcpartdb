import 'reflect-metadata';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import {
  ListProductSourcesFilter,
  ListProductSourcesQuery,
  ProductSourceGroup,
  ProductType,
} from '@pcpartdb/shared';
import { productSourceService } from 'packages/website/src/client/product';
import {
  Checkbox,
  TextInput,
} from 'packages/website/src/client/shared/components';
import { InfoAlert } from 'packages/website/src/client/shared/components/Alert/InfoAlert';
import { GenericButton } from 'packages/website/src/client/shared/components/Button/GenericButton';
import { Pagination } from 'packages/website/src/client/shared/components/Pagination/Pagination';
import { useDebounce } from 'packages/website/src/client/shared/hooks/useDebounce';
import React, { useCallback, useEffect, useState } from 'react';
import { CpuSourceCard } from './CpuSourceCard';

const LIMIT = 10;
const FILTER_DEBOUNCE = 300;

interface CpuSourcesTabProps {}

export const CpuSourcesTab = (_props: CpuSourcesTabProps) => {
  // States

  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ProductSourceGroup[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState<ListProductSourcesQuery>({
    filter: { productType: ProductType.Cpu, includeArchived: showArchived },
    pagination: { offset: 0, limit: LIMIT },
  });

  // Callbacks

  const fetchSourceGroups = useCallback(async (q: ListProductSourcesQuery) => {
    setLoading(true);
    const response = await productSourceService.listGroups({ query: q });
    setQuery(response.query);
    setItems(response.results);
    setTotal(response.total);
    setLoading(false);
  }, []);

  const filterSources = useCallback(
    (value: string) => {
      const filter: ListProductSourcesFilter = {
        ...query.filter,
        sourceNameContains: value || undefined,
      };
      fetchSourceGroups({ ...query, filter });
    },
    [fetchSourceGroups, query],
  );
  const debouncedFilterSources = useDebounce(filterSources, FILTER_DEBOUNCE);

  const toggleArchived = useCallback(
    (checked: boolean) => {
      const filter: ListProductSourcesFilter = {
        ...query.filter,
        includeArchived: checked,
      };
      setShowArchived(checked);
      fetchSourceGroups({ ...query, filter });
    },
    [fetchSourceGroups, query],
  );

  const refresh = useCallback(() => {
    fetchSourceGroups({ ...query });
  }, [fetchSourceGroups, query]);

  const changePage = useCallback(
    (offset: number, limit: number) => {
      const pagination = { offset, limit };
      fetchSourceGroups({ ...query, pagination });
    },
    [fetchSourceGroups, query],
  );

  // Effects

  useEffect(() => {
    fetchSourceGroups(query);
    // Only run this once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-4">
        <div className="flex flex-1 gap-4 max-w-[50%]">
          <TextInput
            placeholder="Filter sources"
            onChange={debouncedFilterSources}
          />
          <Checkbox
            value={showArchived}
            onChange={toggleArchived}
            className="flex-1 whitespace-nowrap"
          >
            Show Archived
          </Checkbox>
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
        <InfoAlert>Fetching CPU Sources. Please wait.</InfoAlert>
      )}

      {!loading && total === 0 && (
        <InfoAlert>No CPU sources. Try refreshing.</InfoAlert>
      )}

      {items.map((sources) => (
        <CpuSourceCard
          key={`${sources[0]?.id}-${sources[1]?.id}-${sources[2]?.id}`}
          sources={sources}
        />
      ))}
    </div>
  );
};
