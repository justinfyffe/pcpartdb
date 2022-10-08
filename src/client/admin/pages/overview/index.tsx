import 'reflect-metadata';
import React from 'react';
import { withStaffGuard } from '../../../auth/with-staff-guard';
import { Article, ArticleHeader } from '../../../shared/components/article';
import { AdminLayout } from '../../../shared/layouts/admin';

interface OverviewPageProps {}

const OverviewPage = (_props: OverviewPageProps) => {
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

export const AdminOverviewPage = withStaffGuard(OverviewPage);
