import { ListGpusOrder, ListGpusSort } from '@pcpartdb/shared';
import React, { FunctionComponent, useCallback, useContext } from 'react';
import { classNames } from '../../../../../shared/ui';
import { ListPageContext } from '../../context';

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
        sort={ListGpusSort.PerformanceRating}
        defaultOrder={ListGpusOrder.Desc}
      >
        Best Performance
      </ListFilterSortItem>
      <ListFilterSortItem
        sort={ListGpusSort.ValueRating}
        defaultOrder={ListGpusOrder.Desc}
      >
        Best Value
      </ListFilterSortItem>
      <ListFilterSortItem
        sort={ListGpusSort.ReleaseDate}
        defaultOrder={ListGpusOrder.Desc}
      >
        Release Date
      </ListFilterSortItem>
    </div>
  );
};

interface ListFilterSortItemProps {
  sort: ListGpusSort;
  defaultOrder?: ListGpusOrder;
  children?: React.ReactNode;
}

const ListFilterSortItem: FunctionComponent<ListFilterSortItemProps> = (
  props,
) => {
  const { sort, defaultOrder } = props;
  const { query, updateQuery } = useContext(ListPageContext);

  const order = query.orderBy?.sort === sort ? query.orderBy?.order : null;

  const handleSortClick = useCallback(() => {
    let newOrder = defaultOrder;
    if (order === ListGpusOrder.Asc) {
      newOrder = ListGpusOrder.Desc;
    } else if (order === ListGpusOrder.Desc) {
      newOrder = ListGpusOrder.Asc;
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
        'cursor-pointer p-2 hover:bg-slate-100 text-content-link text-left',
        query.orderBy?.sort === sort ? 'font-bold' : '',
      )}
    >
      {props.children} {order === ListGpusOrder.Asc ? <>&#9650;</> : <></>}{' '}
      {order === ListGpusOrder.Desc ? <>&#9660;</> : <></>}
    </button>
  );
};
