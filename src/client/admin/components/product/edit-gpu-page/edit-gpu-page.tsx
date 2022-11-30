import 'reflect-metadata';
import { Button, ButtonVariant } from '@client/shared/components';
import { AdminLayout } from '@client/shared/layouts';
import { Product } from '@shared/product';
import React from 'react';
import { GpuForm } from '../gpu-form';

export interface AdminEditGpuPageProps {
  gpu: Product;
}

export const AdminEditGpuPage = (props: AdminEditGpuPageProps) => {
  const { gpu } = props;

  return (
    <AdminLayout>
      <article>
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold">GPUs - Edit GPU</h1>

          <Button href="/admin/gpus" variant={ButtonVariant.Default}>
            Back
          </Button>
        </div>

        <GpuForm gpu={gpu} />
      </article>
    </AdminLayout>
  );
};
