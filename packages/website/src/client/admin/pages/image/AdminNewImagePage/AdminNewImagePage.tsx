import 'reflect-metadata';
import { getAdminListImagesPath } from '@pcpartdb/shared';
import { GenericButton } from 'packages/website/src/client/shared/components/Button/GenericButton';
import {
  MetaRobots,
  Seo,
} from 'packages/website/src/client/shared/components/Seo/Seo';
import { AdminLayout } from 'packages/website/src/client/shared/layouts/admin/AdminLayout';
import React from 'react';
import { ImageForm } from '../../../components/image/ImageForm/ImageForm';

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

          <GenericButton href={getAdminListImagesPath()}>Back</GenericButton>
        </div>

        <ImageForm />
      </article>
    </AdminLayout>
  );
};
