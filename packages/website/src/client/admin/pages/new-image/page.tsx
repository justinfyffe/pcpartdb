import 'reflect-metadata';
import { MetaRobots } from '@pcpartdb/shared/website';
import React from 'react';
import { ImageForm } from '../../../admin/components';
import { Button, ButtonVariant } from '../../../shared/components';
import { AdminLayout } from '../../../shared/layouts';

interface AdminNewImagePageProps {}

export const AdminNewImagePage = (_props: AdminNewImagePageProps) => {
  const title = 'New Image';
  const robots = [MetaRobots.NOINDEX];

  return (
    <AdminLayout seo={{ title, robots }}>
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
