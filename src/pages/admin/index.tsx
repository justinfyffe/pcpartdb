import 'reflect-metadata';
import React from 'react';
import { withStaffGuard } from '../../web/auth/with-staff-guard';
import { Article, ArticleHeader } from '../../web/shared/components/article';
import { AdminLayout } from '../../web/shared/layouts/admin';

interface AdminIndexPageProps {}

const AdminIndexPage = (_props: AdminIndexPageProps) => {
  return (
    <AdminLayout>
      <Article>
        <ArticleHeader>
          <h1>Overview</h1>
        </ArticleHeader>
      </Article>
    </AdminLayout>
  );
};

export default withStaffGuard(AdminIndexPage);
