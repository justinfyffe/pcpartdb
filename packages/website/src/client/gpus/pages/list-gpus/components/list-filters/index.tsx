import React, { FunctionComponent } from 'react';
import { classNames } from '../../../../../shared/ui';
import { ListFilterComnpany } from './list-filter-company';
import { ListFilterSort } from './list-filter-sort';

interface ListFiltersProps {
  className?: string;
}

export const ListFilters: FunctionComponent<ListFiltersProps> = (props) => {
  return (
    <div
      className={classNames(
        'flex flex-col gap-4 min-w-62 p-2',
        props.className,
      )}
    >
      <ListFilterSort />
      <ListFilterComnpany />
    </div>
  );
};
