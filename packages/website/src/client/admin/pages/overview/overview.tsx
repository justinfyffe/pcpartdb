import 'reflect-metadata';
import { AdminLayout } from '@pcpartdb/website/client/shared/layouts';
import React from 'react';

interface AdminOverviewPageProps {}

export const AdminOverviewPage = (_props: AdminOverviewPageProps) => {
  return (
    <AdminLayout>
      <article>
        <h1 className="font-semibold mb-4">Overview</h1>
      </article>
    </AdminLayout>
  );
};
