import 'reflect-metadata';
import { Tab } from 'packages/website/src/client/shared/components/Tabs/Tab';
import {
  Tabs,
  TabsVariant,
} from 'packages/website/src/client/shared/components/Tabs/Tabs';
import { AutomationStatusContext } from 'packages/website/src/client/shared/layouts/admin/AutomationStatusContext';
import React, { useContext, useMemo } from 'react';
import { GpuChipsetSourcesTab } from './GpuChipsetSourcesTab';

interface GpuSourcesTabProps {}

export const GpuSourcesTab = (_props: GpuSourcesTabProps) => {
  const automationStatusContext = useContext(AutomationStatusContext);

  const chipsetsLabel = useMemo(() => {
    const pending = automationStatusContext.status?.pendingGpuSources || 0;
    return ['Chipsets', pending ? `(${pending})` : ''].join(' ').trim();
  }, [automationStatusContext.status?.pendingGpuSources]);

  // Render

  return (
    <Tabs variant={TabsVariant.Buttons} loadOnDemand>
      <Tab label={chipsetsLabel}>
        <GpuChipsetSourcesTab />
      </Tab>
    </Tabs>
  );
};
