import 'reflect-metadata';
import { GpuForm } from '@pcpartdb/website/client/admin/components';
import {
  Button,
  ButtonVariant,
} from '@pcpartdb/website/client/shared/components';
import { AdminLayout } from '@pcpartdb/website/client/shared/layouts';
import { Gpu } from '@pcpartdb/website/shared/gpus';
import React from 'react';

export interface AdminEditGpuPageProps {
  gpu: Gpu;
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
