import 'reflect-metadata';
import React from 'react';
import { withStaffGuard } from '../../../web/auth/with-staff-guard';
import { AdminLayout } from '../../../web/shared/layouts/admin';

interface AdminUsersPageProps {}

const AdminUsersPage = (_props: AdminUsersPageProps) => {
  return (
    <AdminLayout>
      <article>
        <header>
          <h1>Users</h1>
        </header>
      </article>
    </AdminLayout>
  );
};

export default withStaffGuard(AdminUsersPage);
