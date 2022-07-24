import 'reflect-metadata';
import React from 'react';
import { withStaffGuard } from '../../../web/auth/with-staff-guard';
import { Article, ArticleHeader } from '../../../web/shared/components/article';
import { Button, ButtonVariant } from '../../../web/shared/components/button';
import { AdminLayout } from '../../../web/shared/layouts/admin';

interface AdminNewGpuPageProps {}

const AdminNewGpuPage = (_props: AdminNewGpuPageProps) => {
  return (
    <AdminLayout>
      <Article>
        <ArticleHeader>
          <h1>GPUs - New GPU</h1>

          <Button href="/admin/gpus" variant={ButtonVariant.Default}>
            Back
          </Button>
        </ArticleHeader>
      </Article>
    </AdminLayout>
  );
};

export default withStaffGuard(AdminNewGpuPage);
