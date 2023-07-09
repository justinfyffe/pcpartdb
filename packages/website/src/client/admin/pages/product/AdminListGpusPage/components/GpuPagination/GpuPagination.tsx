import { getAdminListGpusPath, ListGpusQuery } from '@pcpartdb/shared';
import React, { FunctionComponent, useCallback } from 'react';
import {
  Pagination,
  PaginationResult,
} from '../../../../../../shared/components';

interface GpuPaginationProps {
  query: ListGpusQuery;
  totalGpus: number;

  onPageClick: (query: ListGpusQuery) => void;
}

export const GpuPagination: FunctionComponent<GpuPaginationProps> = (props) => {
  const { query, totalGpus, onPageClick } = props;

  const paginationPageClick = useCallback(
    (result: PaginationResult, evt: React.MouseEvent) => {
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
    (result: PaginationResult) =>
      getAdminListGpusPath({
        ...query,
        pagination: { offset: result.offset, limit: result.limit },
      }),
    [query],
  );

  return (
    <Pagination
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
