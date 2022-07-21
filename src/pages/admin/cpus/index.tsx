import 'reflect-metadata';
import React from 'react';
import { withStaffGuard } from '../../../web/auth/with-staff-guard';
import { AdminLayout } from '../../../web/shared/layouts/admin';

interface AdminCpusPageProps {}

const AdminCpusPage = (_props: AdminCpusPageProps) => {
  return (
    <AdminLayout>
      <article>
        <header>
          <h1>CPUs</h1>
        </header>
      </article>
    </AdminLayout>
  );
};

export default withStaffGuard(AdminCpusPage);
