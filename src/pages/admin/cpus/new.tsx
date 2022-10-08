import 'reflect-metadata';
import React from 'react';
import { withStaffGuard } from '../../../client/auth/with-staff-guard';
import {
  Article,
  ArticleHeader,
} from '../../../client/shared/components/article';
import {
  Button,
  ButtonVariant,
} from '../../../client/shared/components/button';
import { AdminLayout } from '../../../client/shared/layouts/admin';

interface AdminNewCpuPageProps {}

const AdminNewCpuPage = (_props: AdminNewCpuPageProps) => {
  return (
    <AdminLayout>
      <Article>
        <ArticleHeader>
          <h1>CPUs - New CPU</h1>

          <Button href="/admin/cpus" variant={ButtonVariant.Default}>
            Back
          </Button>
        </ArticleHeader>
      </Article>
    </AdminLayout>
  );
};

export default withStaffGuard(AdminNewCpuPage);
