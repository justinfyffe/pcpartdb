import 'reflect-metadata';
import { ImageForm } from '@pcpartdb/website/client/admin/components';
import {
  Button,
  ButtonVariant,
} from '@pcpartdb/website/client/shared/components';
import { AdminLayout } from '@pcpartdb/website/client/shared/layouts';
import { Image } from '@pcpartdb/website/shared/image';
import { MetaRobots } from '@pcpartdb/website/shared/website';
import React from 'react';

export interface AdminEditImagePageProps {
  image: Image;
}

export const AdminEditImagePage = (props: AdminEditImagePageProps) => {
  const { image } = props;

  const title = `Edit Image: ${image.name}`;
  const robots = [MetaRobots.NOINDEX];

  return (
    <AdminLayout seo={{ title, robots }}>
      <article>
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold">Images - Edit Image</h1>

          <Button href="/admin/images" variant={ButtonVariant.Default}>
            Back
          </Button>
        </div>

        <ImageForm image={props.image} />
      </article>
    </AdminLayout>
  );
};
