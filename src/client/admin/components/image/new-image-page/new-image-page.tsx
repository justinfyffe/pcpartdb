import 'reflect-metadata';
import { Button, ButtonVariant } from '@client/shared/components';
import { AdminLayout } from '@client/shared/layouts';
import React from 'react';
import { ImageForm } from '../image-form';

interface AdminNewImagePageProps {}

export const AdminNewImagePage = (_props: AdminNewImagePageProps) => {
  return (
    <AdminLayout>
      <article>
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold">Images - Upload Image</h1>

          <Button href="/admin/images" variant={ButtonVariant.Default}>
            Back
          </Button>
        </div>

        <ImageForm />
      </article>
    </AdminLayout>
  );
};
