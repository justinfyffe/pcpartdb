import 'reflect-metadata';
import { GpuForm } from '@client/admin/components';
import { Button, ButtonVariant } from '@client/shared/components';
import { AdminLayout } from '@client/shared/layouts';
import { Part } from '@shared/part';
import React from 'react';

export interface AdminEditGpuPageProps {
  gpu: Part;
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
