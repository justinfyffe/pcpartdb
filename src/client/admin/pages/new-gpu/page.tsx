import 'reflect-metadata';
import { GpuForm } from '@client/admin/components';
import { Button, ButtonVariant } from '@client/shared/components';
import { AdminLayout } from '@client/shared/layouts';
import React from 'react';

interface AdminNewGpuPageProps {}

export const AdminNewGpuPage = (_props: AdminNewGpuPageProps) => {
  return (
    <AdminLayout>
      <article>
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold">GPUs - New GPU</h1>

          <Button href="/admin/gpus" variant={ButtonVariant.Default}>
            Back
          </Button>
        </div>

        <GpuForm />
      </article>
    </AdminLayout>
  );
};
