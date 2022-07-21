import 'reflect-metadata';
import React from 'react';
import { withStaffGuard } from '../../../web/auth/with-staff-guard';
import { AdminLayout } from '../../../web/shared/layouts/admin';

interface AdminImagesPageProps {}

const AdminImagesPage = (_props: AdminImagesPageProps) => {
  return (
    <AdminLayout>
      <article>
        <header>
          <h1>Images</h1>
        </header>
      </article>
    </AdminLayout>
  );
};

export default withStaffGuard(AdminImagesPage);
