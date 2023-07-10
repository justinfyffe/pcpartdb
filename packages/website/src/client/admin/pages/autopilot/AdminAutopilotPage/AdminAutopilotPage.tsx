import 'reflect-metadata';
import { AdminAutopilotViewModel } from '@pcpartdb/shared';
import React from 'react';
import { MetaRobots, Seo, Tab, Tabs } from '../../../../shared/components';
import { AdminLayout } from '../../../../shared/layouts';
import { AutopilotCpusTab, AutopilotGpusTab } from './components';

export const AdminAutopilotPage = (props: AdminAutopilotViewModel) => {
  const seoTitle = 'Autopilot - Admin Panel';
  const seoRobots = [MetaRobots.NOINDEX, MetaRobots.NOFOLLOW];

  return (
    <AdminLayout>
      <Seo title={seoTitle} robots={seoRobots} />

      <article>
        <h1 className="font-semibold mb-4">Autopilot</h1>

        {/* TODO: use buttons style of tabs */}
        <Tabs>
          <Tab label="CPUs">
            <AutopilotCpusTab />
          </Tab>

          <Tab label="GPUs">
            <AutopilotGpusTab />
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
