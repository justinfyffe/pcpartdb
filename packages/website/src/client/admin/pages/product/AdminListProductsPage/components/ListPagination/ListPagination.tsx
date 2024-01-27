import { getAdminListProductsPath, ListProductsQuery } from '@pcpartdb/shared';
import {
  LegacyPagination,
  LegacyPaginationResult,
} from 'packages/website/src/client/shared/components/Pagination/LegacyPagination';
import React, { FunctionComponent, useCallback, useContext } from 'react';
import { AdminListProductsContext } from '../../context/AdminListProductsContext';

interface ListPaginationProps {
  //
}

export const ListPagination: FunctionComponent<ListPaginationProps> = () => {
  const context = useContext(AdminListProductsContext);
  const { query, totalProducts, updateQuery } = context;

  const handlePageClick = useCallback(
    (query: ListProductsQuery) => {
      updateQuery(query);
    },
    [updateQuery],
  );

  const paginationPageClick = useCallback(
    (result: LegacyPaginationResult, evt: React.MouseEvent) => {
      evt.preventDefault();
      evt.stopPropagation();
      handlePageClick?.({
        ...query,
        pagination: { offset: result.offset, limit: result.limit },
      });
    },
    [query, handlePageClick],
  );

  const paginationHrefBuilder = useCallback(
    (result: LegacyPaginationResult) =>
      getAdminListProductsPath({
        ...query,
        pagination: { offset: result.offset, limit: result.limit },
      }),
    [query],
  );

  return (
    <LegacyPagination
      resultsOffset={query.pagination?.offset}
      resultsPerPage={query.pagination?.limit}
      totalResults={totalProducts}
      onPageClick={paginationPageClick}
      hrefBuilder={paginationHrefBuilder}
      neighborPagesClassName="lg:hidden"
      hidePages={false}
    />
  );
};
