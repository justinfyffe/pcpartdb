import 'reflect-metadata';
import { AdminEditGpuViewModel, getAdminListGpusPath } from '@pcpartdb/shared';
import React from 'react';
import { GpuForm } from '../../../admin/components';
import {
  Button,
  ButtonVariant,
  MetaRobots,
  Seo,
} from '../../../shared/components';
import { AdminLayout } from '../../../shared/layouts';

export const AdminEditGpuPage = (props: AdminEditGpuViewModel) => {
  const { gpu } = props;

  const pageTitle = 'Edit GPU';
  const seoTitle = `${pageTitle} - Admin Panel`;
  const seoRobots = [MetaRobots.NOINDEX, MetaRobots.NOFOLLOW];

  return (
    <AdminLayout>
      <Seo title={seoTitle} robots={seoRobots} />

      <article>
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold">{pageTitle}</h1>

          <Button href={getAdminListGpusPath()} variant={ButtonVariant.Default}>
            Back
          </Button>
        </div>

        <GpuForm gpu={gpu} />
      </article>
    </AdminLayout>
  );
};
