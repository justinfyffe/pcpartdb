import 'reflect-metadata';
import { AdminDataUpdatesViewModel, DataUpdateStatus } from '@pcpartdb/shared';
import React from 'react';
import { MetaRobots, Seo, Tab, Tabs } from '../../../../shared/components';
import { AdminLayout } from '../../../../shared/layouts';
import { UpdatesTab } from './components';

export const AdminDataUpdatesPage = (props: AdminDataUpdatesViewModel) => {
  const { status, updates, totalUpdates } = props;

  const pageTitle = 'Data Updates';
  const seoTitle = `${pageTitle} - Admin Panel`;
  const seoRobots = [MetaRobots.NOINDEX, MetaRobots.NOFOLLOW];

  return (
    <AdminLayout>
      <Seo title={seoTitle} robots={seoRobots} />

      <article>
        <h1 className="font-semibold mb-4">{pageTitle}</h1>

        <nav>
          <Tabs activeTab={0} loadOnDemand>
            <Tab label="Pending">
              <UpdatesTab
                status={DataUpdateStatus.Pending}
                updates={
                  status === DataUpdateStatus.Pending ? updates : undefined
                }
                totalUpdates={
                  status === DataUpdateStatus.Pending ? totalUpdates : undefined
                }
              />
            </Tab>
            <Tab label="Approved">
              <UpdatesTab
                status={DataUpdateStatus.Approved}
                updates={
                  status === DataUpdateStatus.Approved ? updates : undefined
                }
                totalUpdates={
                  status === DataUpdateStatus.Approved
                    ? totalUpdates
                    : undefined
                }
              />
            </Tab>
            <Tab label="Rejected">
              <UpdatesTab
                status={DataUpdateStatus.Rejected}
                updates={
                  status === DataUpdateStatus.Rejected ? updates : undefined
                }
                totalUpdates={
                  status === DataUpdateStatus.Rejected
                    ? props.totalUpdates
                    : undefined
                }
              />
            </Tab>
          </Tabs>
        </nav>
      </article>
    </AdminLayout>
  );
};
