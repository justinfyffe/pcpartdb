import 'reflect-metadata';
import React from 'react';
import { GpuForm } from '../../../admin/components';
import { Button, ButtonVariant } from '../../../shared/components';
import { AdminLayout } from '../../../shared/layouts';

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
