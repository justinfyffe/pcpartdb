import React, { FunctionComponent } from 'react';
import { classNames } from '../../../../../../shared/ui';
import { ListFilterComnpany } from './ListFilterCompany';
import { ListFilterMarketSegment } from './ListFilterMarketSegment';
import { ListFilterSort } from './ListFilterSort';

interface ListFiltersProps {
  className?: string;
}

export const ListFilters: FunctionComponent<ListFiltersProps> = (props) => {
  return (
    <div className={classNames('flex flex-col min-w-62', props.className)}>
      <ListFilterSort />
      <ListFilterComnpany />
      <ListFilterMarketSegment />
    </div>
  );
};
