import { getAdminListCpusPath, ListCpusQuery } from '@pcpartdb/shared';
import {
  LegacyPagination,
  LegacyPaginationResult,
} from 'packages/website/src/client/shared/components/Pagination/LegacyPagination';
import React, { FunctionComponent, useCallback } from 'react';

interface CpuPaginationProps {
  query: ListCpusQuery;
  totalCpus: number;

  onPageClick: (query: ListCpusQuery) => void;
}

export const CpuPagination: FunctionComponent<CpuPaginationProps> = (props) => {
  const { query, totalCpus, onPageClick } = props;

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
      getAdminListCpusPath({
        ...query,
        pagination: { offset: result.offset, limit: result.limit },
      }),
    [query],
  );

  return (
    <LegacyPagination
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
