import {
  AdjustmentsHorizontalIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import { Menu } from 'packages/website/src/app/_common/components/Menu/Menu';
import { classNames } from 'packages/website/src/app/_common/utils/classNames';
import React, { FunctionComponent } from 'react';
import { ListFilters } from '../ListFilters/ListFilters';
import { ListPresets } from '../ListPresets/ListPresets';

interface ListMenuProps {
  includeFilters?: boolean;
  includePresets?: boolean;
  className?: string;
}

export const ListMenu: FunctionComponent<ListMenuProps> = (props) => {
  return (
    <Menu
      label={<AdjustmentsHorizontalIcon className="w-8" />}
      ariaLabel="GPU Filters"
      className={classNames('-mr-4', props.className)}
      overlayClassName="w-62 max-h-125 overflow-x-hidden overflow-y-auto"
    >
      {props.includeFilters && <ListFilters />}
      {props.includePresets && <ListPresets />}
    </Menu>
  );
};
