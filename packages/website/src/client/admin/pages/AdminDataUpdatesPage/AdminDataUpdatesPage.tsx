import 'reflect-metadata';
import {
  AdminDataUpdatesViewModel,
  DataUpdateStatus,
  DEFAULT_LIST_DATA_UPDATES_LIMIT,
  DEFAULT_LIST_DATA_UPDATES_OFFSET,
} from '@pcpartdb/shared';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  AlertVariant,
  MetaRobots,
  Pagination,
  PaginationResult,
  Seo,
  Tab,
  Tabs,
} from '../../../shared/components';
import { AdminLayout } from '../../../shared/layouts';
import { UpdatesTab } from './components';

export const AdminDataUpdatesPage = (props: AdminDataUpdatesViewModel) => {
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
                  props.status === DataUpdateStatus.Pending
                    ? props.updates
                    : undefined
                }
                totalUpdates={
                  props.status === DataUpdateStatus.Pending
                    ? props.totalUpdates
                    : undefined
                }
              />
            </Tab>
            <Tab label="Approved">
              <UpdatesTab
                status={DataUpdateStatus.Approved}
                updates={
                  props.status === DataUpdateStatus.Approved
                    ? props.updates
                    : undefined
                }
                totalUpdates={
                  props.status === DataUpdateStatus.Approved
                    ? props.totalUpdates
                    : undefined
                }
              />
            </Tab>
            <Tab label="Rejected">
              <UpdatesTab
                status={DataUpdateStatus.Rejected}
                updates={
                  props.status === DataUpdateStatus.Rejected
                    ? props.updates
                    : undefined
                }
                totalUpdates={
                  props.status === DataUpdateStatus.Rejected
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
