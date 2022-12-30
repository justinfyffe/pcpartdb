import { Menu, MenuLinkItem } from '@client/shared/components';
import { classNames } from '@client/shared/ui';
import { getListGpusPath } from '@client/shared/website';
import { Bars3Icon } from '@heroicons/react/24/outline';
import React, { FunctionComponent } from 'react';
import { ListPresetSlug } from '../../types';
import { ListFilters } from '../list-filters';

interface ListPresetsMenuProps {
  includeFilters?: boolean;
  className?: string;
}

export const ListPresetsMenu: FunctionComponent<ListPresetsMenuProps> = (
  props,
) => {
  return (
    <Menu
      label={<Bars3Icon className="w-8" />}
      className={classNames('-mr-4', props.className)}
      overlayClassName="w-62 max-h-125 overflow-x-hidden overflow-y-auto"
    >
      {props.includeFilters && <ListFilters />}

      <section>
        <div className="font-bold p-2">Lists:</div>
        <div className="flex flex-col">
          <MenuLinkItem href={getListGpusPath(ListPresetSlug.BestPerformance)}>
            Best performance GPUs
          </MenuLinkItem>
          <MenuLinkItem
            href={getListGpusPath(ListPresetSlug.BestPerformanceAmd)}
          >
            Best performance AMD GPUs
          </MenuLinkItem>
          <MenuLinkItem
            href={getListGpusPath(ListPresetSlug.BestPerformanceNvidia)}
          >
            Best performance NVIDIA GPUs
          </MenuLinkItem>
          <MenuLinkItem href={getListGpusPath(ListPresetSlug.BestValue)}>
            Best value GPUs
          </MenuLinkItem>
          <MenuLinkItem href={getListGpusPath(ListPresetSlug.BestValueAmd)}>
            Best value AMD GPUs
          </MenuLinkItem>
          <MenuLinkItem href={getListGpusPath(ListPresetSlug.BestValueNvidia)}>
            Best value NVIDIA GPUs
          </MenuLinkItem>
        </div>
      </section>
    </Menu>
  );
};
