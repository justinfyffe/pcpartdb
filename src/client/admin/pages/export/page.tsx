import 'reflect-metadata';
import { Button, ButtonVariant } from '@client/shared/components';
import { AdminLayout } from '@client/shared/layouts';
import React from 'react';

export interface AdminExportPageProps {}

export const AdminExportPage = (_props: AdminExportPageProps) => {
  return (
    <AdminLayout>
      <article>
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold">Export Content</h1>
        </div>

        <Button
          href="/api/export"
          target="_blank"
          variant={ButtonVariant.Primary}
        >
          Export
        </Button>
      </article>
    </AdminLayout>
  );
};
