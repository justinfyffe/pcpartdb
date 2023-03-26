import { getListGpusPath } from '@pcpartdb/shared';
import React, { FunctionComponent, useCallback, useContext } from 'react';
import { Pagination, PaginationResult } from '../../../../../shared/components';
import { ListPageContext } from '../../context';

export const ListPagination: FunctionComponent = () => {
  const { query, updateQuery, totalResults } = useContext(ListPageContext);

  const paginationPageClick = useCallback(
    (result: PaginationResult, evt: React.MouseEvent) => {
      evt.preventDefault();
      evt.stopPropagation();
      updateQuery({ ...query, offset: result.offset, limit: result.limit });
    },
    [query, updateQuery],
  );

  const paginationHrefBuilder = useCallback(
    (result: PaginationResult) =>
      getListGpusPath({ ...query, offset: result.offset, limit: result.limit }),
    [query],
  );

  return (
    <Pagination
      resultsOffset={query.offset}
      resultsPerPage={query.limit}
      totalResults={totalResults}
      onPageClick={paginationPageClick}
      hrefBuilder={paginationHrefBuilder}
      neighborPagesClassName="lg:hidden"
      hidePages={false}
    />
  );
};
