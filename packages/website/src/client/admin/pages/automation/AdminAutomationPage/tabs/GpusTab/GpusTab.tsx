import 'reflect-metadata';
import { Tab } from 'packages/website/src/client/shared/components/Tabs/Tab';
import {
  Tabs,
  TabsVariant,
} from 'packages/website/src/client/shared/components/Tabs/Tabs';
import { AutomationStatusContext } from 'packages/website/src/client/shared/layouts/admin/AutomationStatusContext';
import React, { useContext, useMemo } from 'react';
import { GpuChipsetsTab } from './GpuChipsetsTab';

interface GpusTabProps {}

export const GpusTab = (_props: GpusTabProps) => {
  const automationStatusContext = useContext(AutomationStatusContext);

  const chipsetsLabel = useMemo(() => {
    const pending = automationStatusContext.status?.pendingGpuUpdates || 0;
    return ['Chipsets', pending ? `(${pending})` : ''].join(' ').trim();
  }, [automationStatusContext.status?.pendingGpuUpdates]);

  // Render

  return (
    <Tabs variant={TabsVariant.Buttons} loadOnDemand>
      <Tab label={chipsetsLabel}>
        <GpuChipsetsTab />
      </Tab>
    </Tabs>
  );
};
