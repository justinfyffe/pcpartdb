import 'reflect-metadata';
import { AdminAutomationViewModel } from '@pcpartdb/shared';
import React from 'react';
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

export const AdminAutomationPage = (_props: AdminAutomationViewModel) => {
  const seoTitle = 'Automation - Admin Panel';
  const seoRobots = [MetaRobots.NOINDEX, MetaRobots.NOFOLLOW];

  return (
    <AdminLayout>
      <Seo title={seoTitle} robots={seoRobots} />

      <article>
        <h1 className="font-semibold mb-4">Automation</h1>

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
