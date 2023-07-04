import { getListCpusPath } from '@pcpartdb/shared';
import React, { FunctionComponent, useCallback, useContext } from 'react';
import {
  Pagination,
  PaginationResult,
} from '../../../../../../shared/components';
import { ListPageContext } from '../../context';

export const ListPagination: FunctionComponent = () => {
  const {
    query,
    updateQuery,
    totalCpus: totalResults,
  } = useContext(ListPageContext);

  const paginationPageClick = useCallback(
    (result: PaginationResult, evt: React.MouseEvent) => {
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
    (result: PaginationResult) =>
      getListCpusPath({
        ...query,
        pagination: { offset: result.offset, limit: result.limit },
      }),
    [query],
  );

  return (
    <Pagination
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
