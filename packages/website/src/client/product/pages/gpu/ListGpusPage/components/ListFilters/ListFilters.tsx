import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import React, { FunctionComponent } from 'react';
import { ListFilterComnpany } from './ListFilterCompany';
import { ListFilterMarketSegment } from './ListFilterMarketSegment';
import { ListFilterPreferredBenchmark } from './ListFilterPreferredBenchmark';
import { ListFilterSort } from './ListFilterSort';

interface ListFiltersProps {
  className?: string;
}

export const ListFilters: FunctionComponent<ListFiltersProps> = (props) => {
  return (
    <div className={classNames('flex flex-col', props.className)}>
      <ListFilterSort />
      <ListFilterComnpany />
      <ListFilterMarketSegment />
      <ListFilterPreferredBenchmark />
    </div>
  );
};
