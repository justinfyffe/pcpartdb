import { Bars3Icon } from '@heroicons/react/24/outline';
import { Menu } from 'packages/website/src/client/shared/components/Menu/Menu';
import React, { FunctionComponent } from 'react';
import { classNames } from '../../../../../../shared/ui';
import { ListFilters } from '../ListFilters';
import { ListPresets } from '../ListPresets';

interface ListMenuProps {
  includeFilters?: boolean;
  includePresets?: boolean;
  className?: string;
}

export const ListMenu: FunctionComponent<ListMenuProps> = (props) => {
  return (
    <Menu
      label={<Bars3Icon className="w-8" />}
      ariaLabel="GPU Filters"
      className={classNames('-mr-4', props.className)}
      overlayClassName="w-62 max-h-125 overflow-x-hidden overflow-y-auto"
    >
      {props.includeFilters && <ListFilters />}
      {props.includePresets && <ListPresets />}
    </Menu>
  );
};
