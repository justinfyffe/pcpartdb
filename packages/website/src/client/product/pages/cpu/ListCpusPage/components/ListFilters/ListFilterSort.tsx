import { ListCpusOrder, ListCpusSort } from '@pcpartdb/shared';
import React, { FunctionComponent, useCallback, useContext } from 'react';
import { classNames } from '../../../../../../shared/ui';
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
        sort={ListCpusSort.PerformanceRating}
        defaultOrder={ListCpusOrder.Desc}
      >
        Best Performance
      </ListFilterSortItem>
      <ListFilterSortItem
        sort={ListCpusSort.ValueRating}
        defaultOrder={ListCpusOrder.Desc}
      >
        Best Value
      </ListFilterSortItem>
      <ListFilterSortItem
        sort={ListCpusSort.ReleaseDate}
        defaultOrder={ListCpusOrder.Desc}
      >
        Release Date
      </ListFilterSortItem>
    </div>
  );
};

interface ListFilterSortItemProps {
  sort: ListCpusSort;
  defaultOrder?: ListCpusOrder;
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
    if (order === ListCpusOrder.Asc) {
      newOrder = ListCpusOrder.Desc;
    } else if (order === ListCpusOrder.Desc) {
      newOrder = ListCpusOrder.Asc;
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
      {props.children} {order === ListCpusOrder.Asc ? <>&#9650;</> : <></>}{' '}
      {order === ListCpusOrder.Desc ? <>&#9660;</> : <></>}
    </button>
  );
};
