import 'reflect-metadata';
import { AdminAutomationViewModel } from '@pcpartdb/shared';
import {
  MetaRobots,
  Seo,
} from 'packages/website/src/client/shared/components/Seo/Seo';
import { AdminLayout } from 'packages/website/src/client/shared/layouts/admin/AdminLayout';
import React from 'react';
import { EnableDisableToggle } from './components/EnableDisableToggle';
import { AutomationTabs } from './tabs/AutomationTabs';

export const AdminAutomationPage = (props: AdminAutomationViewModel) => {
  const seoTitle = 'Automation - Admin Panel';
  const seoRobots = [MetaRobots.NOINDEX, MetaRobots.NOFOLLOW];

  // Render

  return (
    <AdminLayout status={props.status}>
      <Seo title={seoTitle} robots={seoRobots} />

      <article>
        <div className="flex justify-between items-center flex-wrap mb-4 gap-4">
          <h1 className="font-semibold mb-0">Automation</h1>

          <EnableDisableToggle />
        </div>

        <AutomationTabs />
      </article>
    </AdminLayout>
  );
};
