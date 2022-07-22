import 'reflect-metadata';
import React from 'react';
import { withStaffGuard } from '../../../web/auth/with-staff-guard';
import { Article, ArticleHeader } from '../../../web/shared/components/article';
import { AdminLayout } from '../../../web/shared/layouts/admin';

interface AdminCpusPageProps {}

const AdminCpusPage = (_props: AdminCpusPageProps) => {
  return (
    <AdminLayout>
      <Article>
        <ArticleHeader>
          <h1>CPUs</h1>
        </ArticleHeader>
      </Article>
    </AdminLayout>
  );
};

export default withStaffGuard(AdminCpusPage);
