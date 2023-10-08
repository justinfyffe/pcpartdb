import 'reflect-metadata';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import {
  CpuAutomationSourceGroup,
  ListAutomationSourcesFilter,
  ListAutomationSourcesQuery,
  ProductType,
} from '@pcpartdb/shared';
import { automationSourceService } from 'packages/website/src/client/product/services/automationSourceService';
import { InfoAlert } from 'packages/website/src/client/shared/components/Alert/InfoAlert';
import { GenericButton } from 'packages/website/src/client/shared/components/Button/GenericButton';
import { Checkbox } from 'packages/website/src/client/shared/components/Checkbox/Checkbox';
import { TextInput } from 'packages/website/src/client/shared/components/Input/TextInput';
import { Pagination } from 'packages/website/src/client/shared/components/Pagination/Pagination';
import { useThrottle } from 'packages/website/src/client/shared/hooks/useThrottle';
import { AutomationStatusContext } from 'packages/website/src/client/shared/layouts/admin/AutomationStatusContext';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { CpuSourceCard } from './CpuSourceCard';

const LIMIT = 10;
const FILTER_THROTTLE_MS = 300;

interface CpuSourcesTabProps {}

export const CpuSourcesTab = (_props: CpuSourcesTabProps) => {
  const automationStatusContext = useContext(AutomationStatusContext);

  // States

  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<CpuAutomationSourceGroup[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState<ListAutomationSourcesQuery>({
    filter: { productType: ProductType.Cpu, includeArchived: showArchived },
    pagination: { offset: 0, limit: LIMIT },
  });

  // Callbacks

  const fetchSourceGroups = useCallback(
    async (q: ListAutomationSourcesQuery) => {
      setLoading(true);
      const response = await automationSourceService.listGroups({ query: q });
      setQuery(response.query);
      setItems(response.results as CpuAutomationSourceGroup[]);
      setTotal(response.total);
      setLoading(false);
    },
    [],
  );

  const filterSources = useCallback(
    (value: string) => {
      const filter: ListAutomationSourcesFilter = {
        ...query.filter,
        search: value || undefined,
      };
      fetchSourceGroups({
        ...query,
        pagination: { offset: 0, limit: LIMIT },
        filter,
      });
    },
    [fetchSourceGroups, query],
  );
  const throttledFilterSources = useThrottle(filterSources, FILTER_THROTTLE_MS);

  const toggleArchived = useCallback(
    (checked: boolean) => {
      const filter: ListAutomationSourcesFilter = {
        ...query.filter,
        includeArchived: checked,
      };
      setShowArchived(checked);
      fetchSourceGroups({ ...query, filter });
    },
    [fetchSourceGroups, query],
  );

  const refresh = useCallback(async () => {
    await fetchSourceGroups({ ...query });
    await automationStatusContext.refreshStatus();
  }, [automationStatusContext, fetchSourceGroups, query]);

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
      <div className="flex justify-between gap-4 flex-wrap">
        <div className="flex flex-1 gap-4 max-w-125">
          <TextInput
            placeholder="Filter sources"
            className="min-w-30 flex-1"
            onChange={throttledFilterSources}
          />
          <Checkbox
            value={showArchived}
            onChange={toggleArchived}
            className="whitespace-nowrap"
          >
            Show Archived
          </Checkbox>
        </div>

        <div className="flex gap-4 items-center ml-auto">
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
