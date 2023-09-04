import { getAdminListGpusPath, ListGpusQuery } from '@pcpartdb/shared';
import {
  LegacyPagination,
  LegacyPaginationResult,
} from 'packages/website/src/client/shared/components/Pagination/LegacyPagination';
import React, { FunctionComponent, useCallback } from 'react';

interface GpuPaginationProps {
  query: ListGpusQuery;
  totalGpus: number;

  onPageClick: (query: ListGpusQuery) => void;
}

export const GpuPagination: FunctionComponent<GpuPaginationProps> = (props) => {
  const { query, totalGpus, onPageClick } = props;

  const paginationPageClick = useCallback(
    (result: LegacyPaginationResult, evt: React.MouseEvent) => {
      evt.preventDefault();
      evt.stopPropagation();
      onPageClick?.({
        ...query,
        pagination: { offset: result.offset, limit: result.limit },
      });
    },
    [query, onPageClick],
  );

  const paginationHrefBuilder = useCallback(
    (result: LegacyPaginationResult) =>
      getAdminListGpusPath({
        ...query,
        pagination: { offset: result.offset, limit: result.limit },
      }),
    [query],
  );

  return (
    <LegacyPagination
      resultsOffset={query.pagination?.offset}
      resultsPerPage={query.pagination?.limit}
      totalResults={totalGpus}
      onPageClick={paginationPageClick}
      hrefBuilder={paginationHrefBuilder}
      neighborPagesClassName="lg:hidden"
      hidePages={false}
    />
  );
};
