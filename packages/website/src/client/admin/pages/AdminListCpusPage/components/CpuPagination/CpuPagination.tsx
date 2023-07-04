import { getAdminListCpusPath, ListCpusQuery } from '@pcpartdb/shared';
import React, { FunctionComponent, useCallback } from 'react';
import { Pagination, PaginationResult } from '../../../../../shared/components';

interface CpuPaginationProps {
  query: ListCpusQuery;
  totalCpus: number;

  onPageClick: (query: ListCpusQuery) => void;
}

export const CpuPagination: FunctionComponent<CpuPaginationProps> = (props) => {
  const { query, totalCpus, onPageClick } = props;

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
      getAdminListCpusPath({
        ...query,
        pagination: { offset: result.offset, limit: result.limit },
      }),
    [query],
  );

  return (
    <Pagination
      resultsOffset={query.pagination?.offset}
      resultsPerPage={query.pagination?.limit}
      totalResults={totalCpus}
      onPageClick={paginationPageClick}
      hrefBuilder={paginationHrefBuilder}
      neighborPagesClassName="lg:hidden"
      hidePages={false}
    />
  );
};
