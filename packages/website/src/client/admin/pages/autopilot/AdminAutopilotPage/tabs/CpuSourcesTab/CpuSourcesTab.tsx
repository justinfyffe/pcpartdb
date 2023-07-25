import 'reflect-metadata';
import {
  ListPagination,
  ListProductSourcesFilter,
  ListProductSourcesQuery,
  ProductSourceGroup,
  ProductType,
} from '@pcpartdb/shared';
import { productSourceService } from 'packages/website/src/client/product';
import {
  Button,
  ButtonVariant,
  Checkbox,
  Pagination,
  PaginationResult,
} from 'packages/website/src/client/shared/components';
import {
  Alert,
  AlertVariant,
} from 'packages/website/src/client/shared/components/Alert';
import React, { useCallback, useEffect, useState } from 'react';
import { CpuSourceCard } from './CpuSourceCard';

interface CpuSourcesTabProps {}

export const CpuSourcesTab = (_props: CpuSourcesTabProps) => {
  const [includeArchived, setIncludeArchived] = useState(false);

  const [sourceGroups, setSourceGroups] = useState<ProductSourceGroup[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [query, setQuery] = useState<ListProductSourcesQuery>({
    filter: { productType: ProductType.Cpu, includeArchived: includeArchived },
    pagination: { offset: 0, limit: 10 },
  });

  const [_loading, setLoading] = useState(false);

  const fetchSourceGroups = useCallback(async (q: ListProductSourcesQuery) => {
    setLoading(true);
    const response = await productSourceService.listGroups(q);
    setQuery(q);
    setSourceGroups(response.sourceGroups);
    setTotalResults(response.totalSourceGroups);
    setLoading(false);
  }, []);

  const handleShowArchivedToggle = useCallback(
    (checked: boolean) => {
      const filter: ListProductSourcesFilter = {
        ...query.filter,
        includeArchived: checked,
      };
      setIncludeArchived(checked);
      setQuery({ ...query, filter });
    },
    [query],
  );

  const handleRefresh = useCallback(() => {
    const pagination: ListPagination = { ...query.pagination, offset: 0 };
    setQuery({ ...query, pagination });
  }, [query]);

  const handlePagination = useCallback(
    (result: PaginationResult) => {
      const pagination: ListPagination = {
        offset: result.offset,
        limit: result.limit,
      };
      setQuery({ ...query, pagination });
    },
    [query],
  );

  useEffect(() => {
    fetchSourceGroups(query);
  }, [fetchSourceGroups, query]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-4">
        <div className="flex flex-1 gap-4">
          <Checkbox value={includeArchived} onChange={handleShowArchivedToggle}>
            Include Archived
          </Checkbox>
        </div>
        <Button variant={ButtonVariant.Generic} onClick={handleRefresh}>
          Refresh
        </Button>
      </div>

      {sourceGroups.map((sources, i) => (
        <CpuSourceCard
          key={`${sources[0]?.id}-${sources[1]?.id}-${sources[2]?.id}`}
          sources={sources}
        />
      ))}

      {totalResults === 0 && (
        <Alert variant={AlertVariant.Info}>No sources.</Alert>
      )}

      <Pagination
        resultsOffset={query.pagination.offset}
        resultsPerPage={query.pagination.limit}
        totalResults={totalResults}
        onPageClick={handlePagination}
      />
    </div>
  );
};
