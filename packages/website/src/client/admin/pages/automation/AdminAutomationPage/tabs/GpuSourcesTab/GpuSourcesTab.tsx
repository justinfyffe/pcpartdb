import 'reflect-metadata';
import {
  Tab,
  Tabs,
  TabsVariant,
} from 'packages/website/src/client/shared/components';
import { AutomationStatusContext } from 'packages/website/src/client/shared/layouts/admin/AutomationStatusContext';
import React, { useContext, useMemo } from 'react';
import { GpuChipsetSourcesTab } from './GpuChipsetSourcesTab';
import { GpuRetailModelSourcesTab } from './GpuRetailModelSourcesTab';

interface GpuSourcesTabProps {}

export const GpuSourcesTab = (_props: GpuSourcesTabProps) => {
  const automationStatusContext = useContext(AutomationStatusContext);

  const chipsetsLabel = useMemo(() => {
    const pending =
      automationStatusContext.status?.pendingGpuChipsetSources || 0;
    return ['Chipsets', pending ? `(${pending})` : ''].join(' ').trim();
  }, [automationStatusContext.status?.pendingGpuChipsetSources]);

  const retailModelsLabel = useMemo(() => {
    const pending =
      automationStatusContext.status?.pendingGpuRetailModelSources || 0;
    return ['Retail Models', pending ? `(${pending})` : ''].join(' ').trim();
  }, [automationStatusContext.status?.pendingGpuRetailModelSources]);

  // Render

  return (
    <Tabs variant={TabsVariant.Buttons} loadOnDemand>
      <Tab label={chipsetsLabel}>
        <GpuChipsetSourcesTab />
      </Tab>
      <Tab label={retailModelsLabel}>
        <GpuRetailModelSourcesTab />
      </Tab>
    </Tabs>
  );
};
