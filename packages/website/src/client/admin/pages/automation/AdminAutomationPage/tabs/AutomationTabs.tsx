import 'reflect-metadata';
import { Tab } from 'packages/website/src/client/shared/components/Tabs/Tab';
import {
  Tabs,
  TabsVariant,
} from 'packages/website/src/client/shared/components/Tabs/Tabs';
import { AutomationStatusContext } from 'packages/website/src/client/shared/layouts/admin/AutomationStatusContext';
import React, { useContext, useMemo } from 'react';
import { CpuSourcesTab, CpusTab, GpuSourcesTab, GpusTab, QueueTab } from '.';

export interface AutomationTabsProps {}

export const AutomationTabs = (_props: AutomationTabsProps) => {
  const automationStatusContext = useContext(AutomationStatusContext);
  const automationStatus = automationStatusContext.status;

  // States & Memos

  const cpuSourcesLabel = useMemo(() => {
    const pending = automationStatus?.pendingCpuSources || 0;
    return ['CPU Sources', pending ? `(${pending})` : ''].join(' ').trim();
  }, [automationStatus]);

  const cpusLabel = useMemo(() => {
    const pending = automationStatus?.pendingCpuUpdates || 0;
    return ['CPUs', pending ? `(${pending})` : ''].join(' ').trim();
  }, [automationStatus]);

  const gpuSourcesLabel = useMemo(() => {
    const pending1 = automationStatus?.pendingGpuSources || 0;
    const pending = pending1;
    return ['GPU Sources', pending ? `(${pending})` : ''].join(' ').trim();
  }, [automationStatus]);

  const gpusLabel = useMemo(() => {
    const pending1 = automationStatus?.pendingGpuUpdates || 0;
    const pending = pending1;
    return ['GPUs', pending ? `(${pending})` : ''].join(' ').trim();
  }, [automationStatus]);

  // Render

  return (
    <Tabs loadOnDemand variant={TabsVariant.Buttons}>
      <Tab label={cpuSourcesLabel}>
        <CpuSourcesTab />
      </Tab>
      <Tab label={cpusLabel}>
        <CpusTab />
      </Tab>
      <Tab label={gpuSourcesLabel}>
        <GpuSourcesTab />
      </Tab>
      <Tab label={gpusLabel}>
        <GpusTab />
      </Tab>
      <Tab label="Queue">
        <QueueTab />
      </Tab>
    </Tabs>
  );
};
