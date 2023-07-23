import 'reflect-metadata';
import {
  ListProductSourcesQuery,
  ProductSourceGroup,
  ProductType,
} from '@pcpartdb/shared';
import { productSourceService } from 'packages/website/src/client/product';
import {
  Alert,
  AlertVariant,
  Button,
  ButtonVariant,
  Checkbox,
  Pagination,
  PaginationResult,
} from 'packages/website/src/client/shared/components';
import React, { useCallback, useEffect, useState } from 'react';
import { CpuSourceCard } from './CpuSourceCard';

interface CpuSourcesTabProps {}

export const CpuSourcesTab = (_props: CpuSourcesTabProps) => {
  const [showArchived, setShowArchived] = useState(false);

  const [sourceGroups, setSourceGroups] = useState<ProductSourceGroup[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [query, setQuery] = useState<ListProductSourcesQuery>({
    filter: { productType: ProductType.Cpu, includeArchived: showArchived },
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
      setShowArchived(checked);
      query.filter.includeArchived = checked;
      fetchSourceGroups(query);
    },
    [fetchSourceGroups, query],
  );

  const handleRefresh = useCallback(() => {
    query.pagination.offset = 0;
    fetchSourceGroups(query);
  }, [fetchSourceGroups, query]);

  const handlePagination = useCallback(
    (result: PaginationResult) => {
      query.pagination.offset = result.offset;
      query.pagination.limit = result.limit;
      fetchSourceGroups(query);
    },
    [fetchSourceGroups, query],
  );

  useEffect(() => {
    fetchSourceGroups(query);
  }, [fetchSourceGroups, query]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end gap-4">
        <Checkbox value={showArchived} onChange={handleShowArchivedToggle}>
          Show Archived
        </Checkbox>
        <Button variant={ButtonVariant.Generic} onClick={handleRefresh}>
          Refresh
        </Button>
      </div>

      {sourceGroups.map((sources, i) => (
        <CpuSourceCard key={i} sources={sources} />
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
