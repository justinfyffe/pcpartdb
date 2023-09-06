import { getListGpusPath } from '@pcpartdb/shared';
import {
  LegacyPagination,
  LegacyPaginationResult,
} from 'packages/website/src/client/shared/components/Pagination/LegacyPagination';
import React, { FunctionComponent, useCallback, useContext } from 'react';
import { ListPageContext } from '../../context/ListPageContext';

export const ListPagination: FunctionComponent = () => {
  const {
    query,
    updateQuery,
    totalGpus: totalResults,
  } = useContext(ListPageContext);

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
      getListGpusPath({
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
