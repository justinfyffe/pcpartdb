import 'reflect-metadata';
import { Tab } from 'packages/website/src/client/shared/components/Tabs/Tab';
import {
  Tabs,
  TabsVariant,
} from 'packages/website/src/client/shared/components/Tabs/Tabs';
import { AutomationStatusContext } from 'packages/website/src/client/shared/layouts/admin/AutomationStatusContext';
import React, { useContext, useMemo } from 'react';
import { GpuChipsetsTab } from './GpuChipsetsTab';
import { GpuRetailModelsTab } from './GpuRetailModelsTab';

interface GpusTabProps {}

export const GpusTab = (_props: GpusTabProps) => {
  const automationStatusContext = useContext(AutomationStatusContext);

  const chipsetsLabel = useMemo(() => {
    const pending =
      automationStatusContext.status?.pendingGpuChipsetUpdates || 0;
    return ['Chipsets', pending ? `(${pending})` : ''].join(' ').trim();
  }, [automationStatusContext.status?.pendingGpuChipsetUpdates]);

  const retailModelsLabel = useMemo(() => {
    const pending =
      automationStatusContext.status?.pendingGpuRetailModelUpdates || 0;
    return ['Retail Models', pending ? `(${pending})` : ''].join(' ').trim();
  }, [automationStatusContext.status?.pendingGpuRetailModelUpdates]);

  // Render

  return (
    <Tabs variant={TabsVariant.Buttons} loadOnDemand>
      <Tab label={chipsetsLabel}>
        <GpuChipsetsTab />
      </Tab>
      <Tab label={retailModelsLabel}>
        <GpuRetailModelsTab />
      </Tab>
    </Tabs>
  );
};
