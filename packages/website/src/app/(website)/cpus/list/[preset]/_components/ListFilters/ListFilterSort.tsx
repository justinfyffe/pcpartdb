'use client';

import { ListOrder, ListSort } from '@pcpartdb/shared';
import { classNames } from 'packages/website/src/app/_common/utils/classNames';
import React, { FunctionComponent, useCallback } from 'react';
import { useListContext } from '../../ListProvider';

interface ListFilterSortProps {
  className?: string;
}

export const ListFilterSort: FunctionComponent<ListFilterSortProps> = (
  props,
) => {
  return (
    <div className={classNames('flex flex-col', props.className)}>
      <div className="font-bold m-2">Sort:</div>
      <ListFilterSortItem
        sort={ListSort.PerformanceRating}
        defaultOrder={ListOrder.Desc}
      >
        Performance
      </ListFilterSortItem>
      <ListFilterSortItem
        sort={ListSort.PerformancePerMsrp}
        defaultOrder={ListOrder.Desc}
      >
        Performance Per Dollar
      </ListFilterSortItem>
      <ListFilterSortItem
        sort={ListSort.ReleaseDate}
        defaultOrder={ListOrder.Desc}
      >
        Release Date
      </ListFilterSortItem>
    </div>
  );
};

interface ListFilterSortItemProps {
  sort: ListSort;
  defaultOrder?: ListOrder;
  children?: React.ReactNode;
}

const ListFilterSortItem: FunctionComponent<ListFilterSortItemProps> = (
  props,
) => {
  const { sort, defaultOrder } = props;
  const { query, updateQuery } = useListContext();

  const order = query.orderBy?.sort === sort ? query.orderBy?.order : null;

  const handleSortClick = useCallback(() => {
    let newOrder = defaultOrder;
    if (order === ListOrder.Asc) {
      newOrder = ListOrder.Desc;
    } else if (order === ListOrder.Desc) {
      newOrder = ListOrder.Asc;
    }

    updateQuery({
      ...query,
      pagination: { ...(query.pagination ?? {}), offset: 0 },
      orderBy: { sort, order: newOrder },
    });
  }, [defaultOrder, order, updateQuery, query, sort]);

  return (
    <button
      onClick={handleSortClick}
      className={classNames(
        'cursor-pointer p-2 hover:bg-mouse-hover text-link text-left',
        query.orderBy?.sort === sort ? 'font-bold' : '',
      )}
    >
      {props.children} {order === ListOrder.Asc ? <>&#9650;</> : <></>}{' '}
      {order === ListOrder.Desc ? <>&#9660;</> : <></>}
    </button>
  );
};
