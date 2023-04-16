import { getAdminListGpusPath, GpusQuery } from '@pcpartdb/shared';
import React, { FunctionComponent, useCallback } from 'react';
import { Pagination, PaginationResult } from '../../../../../shared/components';

interface GpuPaginationProps {
  query: GpusQuery;
  totalGpus: number;

  onPageClick: (query: GpusQuery) => void;
}

export const GpuPagination: FunctionComponent<GpuPaginationProps> = (props) => {
  const { query, totalGpus, onPageClick } = props;

  const paginationPageClick = useCallback(
    (result: PaginationResult, evt: React.MouseEvent) => {
      evt.preventDefault();
      evt.stopPropagation();
      onPageClick?.({ ...query, offset: result.offset, limit: result.limit });
    },
    [query, onPageClick],
  );

  const paginationHrefBuilder = useCallback(
    (result: PaginationResult) =>
      getAdminListGpusPath({
        ...query,
        offset: result.offset,
        limit: result.limit,
      }),
    [query],
  );

  return (
    <Pagination
      resultsOffset={query.offset}
      resultsPerPage={query.limit}
      totalResults={totalGpus}
      onPageClick={paginationPageClick}
      hrefBuilder={paginationHrefBuilder}
      neighborPagesClassName="lg:hidden"
      hidePages={false}
    />
  );
};
