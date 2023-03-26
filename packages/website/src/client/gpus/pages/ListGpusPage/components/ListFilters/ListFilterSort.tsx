import { GpuSort } from '@pcpartdb/shared';
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
    <div className={classNames('flex flex-col gap-2', props.className)}>
      <div className="font-bold">Sort:</div>
      <ListFilterSortItem sort={GpuSort.PerformanceRating}>
        Best Performance
      </ListFilterSortItem>
      <ListFilterSortItem sort={GpuSort.ValueRating}>
        Best Value
      </ListFilterSortItem>
    </div>
  );
};

interface ListFilterSortItemProps {
  sort?: GpuSort;
  children?: React.ReactNode;
}

const ListFilterSortItem: FunctionComponent<ListFilterSortItemProps> = (
  props,
) => {
  const { sort } = props;
  const { query, updateQuery } = useContext(ListPageContext);

  const handleSortClick = useCallback(() => {
    updateQuery({
      ...query,
      offset: 0,
      orderBy: { sort },
    });
  }, [query, sort, updateQuery]);

  return (
    <a
      onClick={handleSortClick}
      className={classNames(
        'cursor-pointer',
        query.orderBy?.sort === sort ? 'font-bold' : '',
      )}
    >
      {props.children}
    </a>
  );
};
