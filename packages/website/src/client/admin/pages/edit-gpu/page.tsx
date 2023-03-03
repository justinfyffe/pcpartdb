import 'reflect-metadata';
import { AdminEditGpuViewModel } from '@pcpartdb/shared/view-models';
import { GpuForm } from '@pcpartdb/website/client/admin/components';
import {
  Button,
  ButtonVariant,
} from '@pcpartdb/website/client/shared/components';
import { AdminLayout } from '@pcpartdb/website/client/shared/layouts';
import React from 'react';

export const AdminEditGpuPage = (props: AdminEditGpuViewModel) => {
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
