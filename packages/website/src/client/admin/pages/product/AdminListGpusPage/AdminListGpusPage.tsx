import 'reflect-metadata';
import { getAdminImportGpusPath, getAdminNewGpuPath } from '@pcpartdb/shared';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import {
  Alert,
  AlertVariant,
  Button,
  ButtonVariant,
  MetaRobots,
  Seo,
  Tab,
  Tabs,
} from '../../../../shared/components';
import { AdminLayout } from '../../../../shared/layouts';
import { ChipsetsTab, RetailModelsTab } from './components';

export const AdminListGpusPage = () => {
  const router = useRouter();
  const [saved] = useState(router.query.saved === 'true');
  const [deleted] = useState(router.query.deleted === 'true');

  const pageTitle = 'GPUs';
  const seoTitle = `${pageTitle} - Admin Panel`;
  const seoRobots = [MetaRobots.NOINDEX, MetaRobots.NOFOLLOW];

  return (
    <AdminLayout>
      <Seo title={seoTitle} robots={seoRobots} />

      <article>
        <section>
          {saved && (
            <Alert variant={AlertVariant.Success}>
              The GPU has been saved.
            </Alert>
          )}

          {deleted && (
            <Alert variant={AlertVariant.Success}>
              The GPU has been deleted.
            </Alert>
          )}
        </section>

        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold">{pageTitle}</h1>

          <div className="flex gap-4">
            <Button
              href={getAdminImportGpusPath()}
              variant={ButtonVariant.Generic}
            >
              Import
            </Button>
            <Button href={getAdminNewGpuPath()} variant={ButtonVariant.Generic}>
              Add
            </Button>
          </div>
        </div>

        <Tabs loadOnDemand>
          <Tab label="Chipsets">
            <ChipsetsTab />
          </Tab>
          <Tab label="Retail Models">
            <RetailModelsTab />
          </Tab>
        </Tabs>
      </article>
    </AdminLayout>
  );
};
