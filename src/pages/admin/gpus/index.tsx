import 'reflect-metadata';
import React from 'react';
import { withStaffGuard } from '../../../web/auth/with-staff-guard';
import { AdminLayout } from '../../../web/shared/layouts/admin';

interface AdminGpusPageProps {}

const AdminGpusPage = (_props: AdminGpusPageProps) => {
  return (
    <AdminLayout>
      <article>
        <header>
          <h1>GPUs</h1>
        </header>
      </article>
    </AdminLayout>
  );
};

export default withStaffGuard(AdminGpusPage);
