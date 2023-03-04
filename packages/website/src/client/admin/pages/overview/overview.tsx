import 'reflect-metadata';
import React from 'react';
import { AdminLayout } from '../../../shared/layouts';

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
