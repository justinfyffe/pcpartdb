import 'reflect-metadata';
import React from 'react';
import { withStaffGuard } from '../../../web/auth/with-staff-guard';
import { Article, ArticleHeader } from '../../../web/shared/components/article';
import { AdminLayout } from '../../../web/shared/layouts/admin';

interface AdminGpusPageProps {}

const AdminGpusPage = (_props: AdminGpusPageProps) => {
  return (
    <AdminLayout>
      <Article>
        <ArticleHeader>
          <h1>GPUs</h1>
        </ArticleHeader>
      </Article>
    </AdminLayout>
  );
};

export default withStaffGuard(AdminGpusPage);
