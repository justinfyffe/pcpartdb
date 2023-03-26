import { Bars3Icon } from '@heroicons/react/24/outline';
import { getListGpusPath, ListGpusPresetSlug } from '@pcpartdb/shared';
import React, { FunctionComponent, useMemo } from 'react';
import { Menu, MenuLinkItem } from '../../../../../shared/components';
import { classNames } from '../../../../../shared/ui';
import { ListFilters } from '../ListFilters';

interface ListPresetsMenuProps {
  includeFilters?: boolean;
  className?: string;
}

export const ListPresetsMenu: FunctionComponent<ListPresetsMenuProps> = (
  props,
) => {
  const presets = [
    {
      slug: ListGpusPresetSlug.BestPerformance,
      label: 'Best performance GPUs',
    },
    {
      slug: ListGpusPresetSlug.BestPerformanceAmd,
      label: 'Best performance AMD GPUs',
    },
    {
      slug: ListGpusPresetSlug.BestPerformanceNvidia,
      label: 'Best performance NVIDIA GPUs',
    },
    {
      slug: ListGpusPresetSlug.BestValue,
      label: 'Best value GPUs',
    },
    {
      slug: ListGpusPresetSlug.BestValueAmd,
      label: 'Best value AMD GPUs',
    },
    {
      slug: ListGpusPresetSlug.BestValueNvidia,
      label: 'Best value NVIDIA GPUs',
    },
  ];

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
          {presets.map((preset) => (
            <ListPresetsMenuItem key={preset.slug} preset={preset.slug}>
              {preset.label}
            </ListPresetsMenuItem>
          ))}
        </div>
      </section>
    </Menu>
  );
};

interface ListPresetsMenuItemProps {
  preset: ListGpusPresetSlug;
  children?: React.ReactNode;
}

export const ListPresetsMenuItem: FunctionComponent<
  ListPresetsMenuItemProps
> = (props) => {
  const { preset, children } = props;

  const href = useMemo(() => getListGpusPath(preset), [preset]);

  return <MenuLinkItem href={href}>{children}</MenuLinkItem>;
};
