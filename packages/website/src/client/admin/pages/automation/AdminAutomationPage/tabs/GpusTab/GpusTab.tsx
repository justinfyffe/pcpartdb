import 'reflect-metadata';
import {
  Tab,
  Tabs,
  TabsVariant,
} from 'packages/website/src/client/shared/components';
import React from 'react';
import { GpuChipsetsTab } from './GpuChipsetsTab';
import { GpuRetailModelsTab } from './GpuRetailModelsTab';

interface GpusTabProps {}

export const GpusTab = (_props: GpusTabProps) => {
  // Render

  return (
    <Tabs variant={TabsVariant.Buttons} loadOnDemand>
      <Tab label="Chipsets">
        <GpuChipsetsTab />
      </Tab>
      <Tab label="Retail Models">
        <GpuRetailModelsTab />
      </Tab>
    </Tabs>
  );
};
