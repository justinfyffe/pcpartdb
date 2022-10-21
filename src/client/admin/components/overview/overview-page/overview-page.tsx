import 'reflect-metadata';
import { withStaffGuard } from '@client/auth';
import { Article, ArticleHeader } from '@client/shared/components';
import { AdminLayout } from '@client/shared/layouts';
import React from 'react';

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
