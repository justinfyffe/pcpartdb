import 'reflect-metadata';
import {
  AdminEditImageViewModel,
  getAdminListImagesPath,
} from '@pcpartdb/shared';
import React from 'react';
import { ImageForm } from '../../../admin/components';
import {
  Button,
  ButtonVariant,
  MetaRobots,
  Seo,
} from '../../../shared/components';
import { AdminLayout } from '../../../shared/layouts';

export const AdminEditImagePage = (props: AdminEditImageViewModel) => {
  const { image } = props;

  const title = `Edit Image: ${image.name}`;

  return (
    <AdminLayout>
      <Seo title={title} robots={[MetaRobots.NOINDEX]} />

      <article>
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold">Images - Edit Image</h1>

          <Button
            href={getAdminListImagesPath()}
            variant={ButtonVariant.Default}
          >
            Back
          </Button>
        </div>

        <ImageForm image={props.image} />
      </article>
    </AdminLayout>
  );
};
