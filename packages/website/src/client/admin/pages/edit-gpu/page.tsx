import 'reflect-metadata';
import { AdminEditGpuViewModel, getAdminListGpusPath } from '@pcpartdb/shared';
import React from 'react';
import { GpuForm } from '../../../admin/components';
import { Button, ButtonVariant } from '../../../shared/components';
import { AdminLayout } from '../../../shared/layouts';

export const AdminEditGpuPage = (props: AdminEditGpuViewModel) => {
  const { gpu } = props;

  return (
    <AdminLayout>
      <article>
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold">GPUs - Edit GPU</h1>

          <Button href={getAdminListGpusPath()} variant={ButtonVariant.Default}>
            Back
          </Button>
        </div>

        <GpuForm gpu={gpu} />
      </article>
    </AdminLayout>
  );
};
