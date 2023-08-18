import 'reflect-metadata';
import { AdminAutomationViewModel } from '@pcpartdb/shared';
import React from 'react';
import { MetaRobots, Seo } from '../../../../shared/components';
import { AdminLayout } from '../../../../shared/layouts';
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
