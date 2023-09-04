import 'reflect-metadata';
import {
  AdminEditImageViewModel,
  getAdminListImagesPath,
} from '@pcpartdb/shared';
import { GenericButton } from 'packages/website/src/client/shared/components/Button/GenericButton';
import {
  MetaRobots,
  Seo,
} from 'packages/website/src/client/shared/components/Seo/Seo';
import React from 'react';
import { AdminLayout } from '../../../../shared/layouts';
import { ImageForm } from '../../../components';

export const AdminEditImagePage = (props: AdminEditImageViewModel) => {
  const { image } = props;

  const pageTitle = 'Edit Image';
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

        <ImageForm image={image} />
      </article>
    </AdminLayout>
  );
};
