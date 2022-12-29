import { Menu, MenuItem } from '@client/shared/components';
import { Bars3Icon } from '@heroicons/react/24/outline';
import React, { FunctionComponent } from 'react';
import { LIST_PRESETS, ListPreset } from '../../types';
import { getListPath } from '../../utils';

export const ListPresetsMenu: FunctionComponent = () => {
  return (
    <Menu
      label={<Bars3Icon className="w-8" />}
      className="-mr-4"
      overlayClassName="w-60"
    >
      <MenuItem href={getListPath(LIST_PRESETS[ListPreset.BestPerformance])}>
        Best Performance GPUs
      </MenuItem>
      <MenuItem href={getListPath(LIST_PRESETS[ListPreset.BestPerformanceAmd])}>
        Best Performance AMD GPUs
      </MenuItem>
      <MenuItem
        href={getListPath(LIST_PRESETS[ListPreset.BestPerformanceNvidia])}
      >
        Best Performance NVIDIA GPUs
      </MenuItem>
      <MenuItem href={getListPath(LIST_PRESETS[ListPreset.BestValue])}>
        Best Value GPUs
      </MenuItem>
      <MenuItem href={getListPath(LIST_PRESETS[ListPreset.BestValueAmd])}>
        Best Value AMD GPUs
      </MenuItem>
      <MenuItem href={getListPath(LIST_PRESETS[ListPreset.BestValueNvidia])}>
        Best Value NVIDIA GPU1s
      </MenuItem>
    </Menu>
  );
};
