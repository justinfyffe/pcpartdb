import 'reflect-metadata';
import { Button, ButtonVariant } from '@client/shared/components';
import { AdminLayout } from '@client/shared/layouts';
import { Image } from '@shared/image';
import React from 'react';
import { ImageForm } from '../image-form';

export interface AdminEditImagePageProps {
  image: Image;
}

export const AdminEditImagePage = (props: AdminEditImagePageProps) => {
  return (
    <AdminLayout>
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
