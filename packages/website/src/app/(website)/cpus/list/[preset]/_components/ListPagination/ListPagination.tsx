'use client';

import { getListCpusPath } from '@pcpartdb/shared';
import {
  LegacyPagination,
  LegacyPaginationResult,
} from 'packages/website/src/app/_common/components/Pagination/LegacyPagination';
import React, { FunctionComponent, useCallback } from 'react';
import { useListContext } from '../../ListProvider';

export const ListPagination: FunctionComponent = () => {
  const { query, updateQuery, totalCpus: totalResults } = useListContext();

  const paginationPageClick = useCallback(
    (result: LegacyPaginationResult, evt: React.MouseEvent) => {
      evt.preventDefault();
      evt.stopPropagation();
      updateQuery({
        ...query,
        pagination: { offset: result.offset, limit: result.limit },
      });
    },
    [query, updateQuery],
  );

  const paginationHrefBuilder = useCallback(
    (result: LegacyPaginationResult) =>
      getListCpusPath({
        ...query,
        pagination: { offset: result.offset, limit: result.limit },
      }),
    [query],
  );

  return (
    <LegacyPagination
      resultsOffset={query.pagination?.offset}
      resultsPerPage={query.pagination?.limit}
      totalResults={totalResults}
      onPageClick={paginationPageClick}
      hrefBuilder={paginationHrefBuilder}
      neighborPagesClassName="lg:hidden"
      hidePages={false}
    />
  );
};
