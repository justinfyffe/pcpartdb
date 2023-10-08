import 'reflect-metadata';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import {
  ListProductUpdatesFilter,
  ListProductUpdatesQuery,
  ProductType,
  ProductUpdate,
  ProductUpdateStatus,
  SubProductType,
} from '@pcpartdb/shared';
import { productUpdateService } from 'packages/website/src/client/product/services/productUpdateService';
import { InfoAlert } from 'packages/website/src/client/shared/components/Alert/InfoAlert';
import { GenericButton } from 'packages/website/src/client/shared/components/Button/GenericButton';
import { TextInput } from 'packages/website/src/client/shared/components/Input/TextInput';
import { Pagination } from 'packages/website/src/client/shared/components/Pagination/Pagination';
import { useThrottle } from 'packages/website/src/client/shared/hooks/useThrottle';
import { AutomationStatusContext } from 'packages/website/src/client/shared/layouts/admin/AutomationStatusContext';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { GpuRetailModelCard } from './GpuRetailModelCard';

const LIMIT = 10;
const FILTER_THROTTLE_MS = 300;

interface GpuRetailModelsTabProps {}

export const GpuRetailModelsTab = (_props: GpuRetailModelsTabProps) => {
  const automationStatusContext = useContext(AutomationStatusContext);

  // States

  const [loading, setLoading] = useState(false);
  const [updates, setUpdates] = useState<ProductUpdate[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState<ListProductUpdatesQuery>({
    filter: {
      productType: ProductType.Gpu,
      status: ProductUpdateStatus.Pending,
      subProductType: SubProductType.GpuRetailModel,
    },
    pagination: { offset: 0, limit: LIMIT },
  });

  // Callbacks

  const fetchGpuUpdates = useCallback(async (q: ListProductUpdatesQuery) => {
    setLoading(true);
    const response = await productUpdateService.listUpdates({ query: q });
    setQuery(response.query);
    setUpdates(response.results as ProductUpdate[]);
    setTotal(response.total);
    setLoading(false);
  }, []);

  const filterUpdates = useCallback(
    (value: string) => {
      const filter: ListProductUpdatesFilter = {
        ...query.filter,
        search: value || undefined,
      };
      fetchGpuUpdates({ ...query, filter });
    },
    [fetchGpuUpdates, query],
  );
  const throttledFilterUpdates = useThrottle(filterUpdates, FILTER_THROTTLE_MS);

  const refresh = useCallback(async () => {
    await fetchGpuUpdates({ ...query });
    await automationStatusContext.refreshStatus();
  }, [automationStatusContext, fetchGpuUpdates, query]);

  const changePage = useCallback(
    (offset: number, limit: number) => {
      const pagination = { offset, limit };
      fetchGpuUpdates({ ...query, pagination });
    },
    [fetchGpuUpdates, query],
  );

  // Effects

  useEffect(() => {
    fetchGpuUpdates(query);
    // Only run this once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-4">
          <div className="flex flex-1 gap-4 max-w-[50%]">
            <TextInput placeholder="Filter" onChange={throttledFilterUpdates} />
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
          <InfoAlert>Fetching GPU updates. Please wait.</InfoAlert>
        )}

        {!loading && total === 0 && (
          <InfoAlert>No GPU updates. Try refreshing.</InfoAlert>
        )}

        {updates.map((update) => (
          <GpuRetailModelCard key={update.id} update={update} />
        ))}
      </div>
    </>
  );
};
