import 'reflect-metadata';
import { Article, ArticleHeader } from '@client/shared/components';
import { AdminLayout } from '@client/shared/layouts';
import React from 'react';

interface AdminOverviewPageProps {}

export const AdminOverviewPage = (_props: AdminOverviewPageProps) => {
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
