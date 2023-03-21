import 'reflect-metadata';
import { getAdminListImagesPath } from '@pcpartdb/shared';
import React from 'react';
import { ImageForm } from '../../../admin/components';
import {
  Button,
  ButtonVariant,
  MetaRobots,
  Seo,
} from '../../../shared/components';
import { AdminLayout } from '../../../shared/layouts';

interface AdminNewImagePageProps {}

export const AdminNewImagePage = (_props: AdminNewImagePageProps) => {
  const pageTitle = 'New Image';
  const seoTitle = `${pageTitle} - Admin Panel`;
  const seoRobots = [MetaRobots.NOINDEX, MetaRobots.NOFOLLOW];

  return (
    <AdminLayout>
      <Seo title={seoTitle} robots={seoRobots} />

      <article>
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold">{pageTitle}</h1>

          <Button
            href={getAdminListImagesPath()}
            variant={ButtonVariant.Default}
          >
            Back
          </Button>
        </div>

        <ImageForm />
      </article>
    </AdminLayout>
  );
};
