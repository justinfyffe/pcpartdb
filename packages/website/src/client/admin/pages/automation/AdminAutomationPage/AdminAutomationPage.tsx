import 'reflect-metadata';
import { AdminAutomationViewModel } from '@pcpartdb/shared';
import { automationService } from 'packages/website/src/client/automation';
import { DangerButton } from 'packages/website/src/client/shared/components/Button/DangerButton';
import { SuccessButton } from 'packages/website/src/client/shared/components/Button/SuccessButton';
import React, { useCallback, useState } from 'react';
import {
  MetaRobots,
  Seo,
  Tab,
  Tabs,
  TabsVariant,
} from '../../../../shared/components';
import { AdminLayout } from '../../../../shared/layouts';
import {
  CpuSourcesTab,
  CpusTab,
  GpuSourcesTab,
  GpusTab,
  QueueTab,
} from './tabs';

export const AdminAutomationPage = (props: AdminAutomationViewModel) => {
  const seoTitle = 'Automation - Admin Panel';
  const seoRobots = [MetaRobots.NOINDEX, MetaRobots.NOFOLLOW];

  const [status, setStatus] = useState(props.status);

  const handleEnable = useCallback(async () => {
    await automationService.updateStatus({ enabled: true });
    setStatus({ ...status, enabled: true });
  }, [status]);

  const handleDisable = useCallback(async () => {
    await automationService.updateStatus({ enabled: false });
    setStatus({ ...status, enabled: false });
  }, [status]);

  return (
    <AdminLayout>
      <Seo title={seoTitle} robots={seoRobots} />

      <article>
        <div className="flex justify-between items-center flex-wrap mb-4">
          <h1 className="font-semibold mb-0">Automation</h1>

          <div className="flex gap-4 items-center ml-auto">
            <span>Status: {status.enabled ? 'Enabled' : 'Disabled'}</span>
            {status.enabled && (
              <DangerButton onClick={handleDisable}>Disable</DangerButton>
            )}
            {!status.enabled && (
              <SuccessButton onClick={handleEnable}>Enable</SuccessButton>
            )}
          </div>
        </div>

        <Tabs loadOnDemand variant={TabsVariant.Buttons}>
          <Tab label="CPU Sources">
            <CpuSourcesTab />
          </Tab>
          <Tab label="CPUs">
            <CpusTab />
          </Tab>
          <Tab label="GPU Sources">
            <GpuSourcesTab />
          </Tab>
          <Tab label="GPUs">
            <GpusTab />
          </Tab>
          <Tab label="Queue">
            <QueueTab />
          </Tab>
        </Tabs>
      </article>
    </AdminLayout>
  );
};
