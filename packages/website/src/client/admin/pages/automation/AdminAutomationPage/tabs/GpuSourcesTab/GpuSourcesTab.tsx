import 'reflect-metadata';
import {
  Tab,
  Tabs,
  TabsVariant,
} from 'packages/website/src/client/shared/components';
import React from 'react';
import { GpuChipsetSourcesTab } from './GpuChipsetSourcesTab';
import { GpuRetailModelSourcesTab } from './GpuRetailModelSourcesTab';

interface GpuSourcesTabProps {}

export const GpuSourcesTab = (_props: GpuSourcesTabProps) => {
  // Render

  return (
    <Tabs variant={TabsVariant.Buttons} loadOnDemand>
      <Tab label="Chipsets">
        <GpuChipsetSourcesTab />
      </Tab>
      <Tab label="Retail Models">
        <GpuRetailModelSourcesTab />
      </Tab>
    </Tabs>
  );
};
