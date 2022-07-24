import 'reflect-metadata';
import React from 'react';
import { withStaffGuard } from '../../../web/auth/with-staff-guard';
import { Article, ArticleHeader } from '../../../web/shared/components/article';
import { Button, ButtonVariant } from '../../../web/shared/components/button';
import { AdminLayout } from '../../../web/shared/layouts/admin';

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
