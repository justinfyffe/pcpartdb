import 'reflect-metadata';
import { getAdminImportGpusPath, getAdminNewGpuPath } from '@pcpartdb/shared';
import { useRouter } from 'next/router';
import { SuccessAlert } from 'packages/website/src/client/shared/components/Alert/SuccessAlert';
import React, { useState } from 'react';
import {
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
          {saved && <SuccessAlert>The GPU has been saved.</SuccessAlert>}

          {deleted && <SuccessAlert>The GPU has been deleted.</SuccessAlert>}
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
