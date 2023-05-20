import { GpuOrder, GpuSort } from '@pcpartdb/shared';
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
        sort={GpuSort.PerformanceRating}
        defaultOrder={GpuOrder.Desc}
      >
        Best Performance
      </ListFilterSortItem>
      <ListFilterSortItem
        sort={GpuSort.ValueRating}
        defaultOrder={GpuOrder.Desc}
      >
        Best Value
      </ListFilterSortItem>
      <ListFilterSortItem
        sort={GpuSort.ReleaseDate}
        defaultOrder={GpuOrder.Desc}
      >
        Release Date
      </ListFilterSortItem>
    </div>
  );
};

interface ListFilterSortItemProps {
  sort: GpuSort;
  defaultOrder?: GpuOrder;
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
    if (order === GpuOrder.Asc) {
      newOrder = GpuOrder.Desc;
    } else if (order === GpuOrder.Desc) {
      newOrder = GpuOrder.Asc;
    }

    updateQuery({
      ...query,
      offset: 0,
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
      {props.children} {order === GpuOrder.Asc ? <>&#9650;</> : <></>}{' '}
      {order === GpuOrder.Desc ? <>&#9660;</> : <></>}
    </button>
  );
};
