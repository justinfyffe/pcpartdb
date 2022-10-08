import 'reflect-metadata';
import React from 'react';
import { withStaffGuard } from '../../../client/auth/with-staff-guard';
import {
  Article,
  ArticleHeader,
} from '../../../client/shared/components/article';
import { AdminLayout } from '../../../client/shared/layouts/admin';

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
