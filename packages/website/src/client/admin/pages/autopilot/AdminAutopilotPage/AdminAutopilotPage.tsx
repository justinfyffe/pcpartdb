import 'reflect-metadata';
import { AdminAutopilotViewModel } from '@pcpartdb/shared';
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
  GpuChipsetsTab,
  GpuRetailModelsTab,
  GpuSourcesTab,
} from './tabs';

export const AdminAutopilotPage = (props: AdminAutopilotViewModel) => {
  const seoTitle = 'Autopilot - Admin Panel';
  const seoRobots = [MetaRobots.NOINDEX, MetaRobots.NOFOLLOW];

  return (
    <AdminLayout>
      <Seo title={seoTitle} robots={seoRobots} />

      <article>
        <h1 className="font-semibold mb-4">Autopilot</h1>

        <Tabs variant={TabsVariant.Buttons}>
          <Tab label="CPU Sources">
            <CpuSourcesTab />
          </Tab>
          <Tab label="CPUs">
            <CpusTab />
          </Tab>
          <Tab label="GPU Sources">
            <GpuSourcesTab />
          </Tab>
          <Tab label="GPU Chipsets">
            <GpuChipsetsTab />
          </Tab>
          <Tab label="GPU Retail Models">
            <GpuRetailModelsTab />
          </Tab>
        </Tabs>

        {/* General - Status, Updates */}
        {/* CPU - Sources - Status, View, Edit, Approve, Reject, Combine */}
        {/* CPU - CPUs - Status, View, Edit, Approve, Approve and Edit, Reject */}
        {/* GPU - Sources - Status, View, Edit, Approve, Reject, Combine */}
        {/* GPU - Chipsets - Status, View, Edit, Approve, Approve and Edit, Reject */}
        {/* GPU - Retail Models - Status, View, Edit, Approve, Approve and Edit, Reject */}
      </article>
    </AdminLayout>
  );
};
