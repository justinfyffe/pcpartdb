import 'reflect-metadata';
import { withStaffGuard } from '@client/auth';
import { Article, ArticleHeader } from '@client/shared/components';
import { AdminLayout } from '@client/shared/layouts';
import React from 'react';

interface ListCpusPageProps {}

const ListCpusPage = (_props: ListCpusPageProps) => {
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

export const AdminListCpusPage = withStaffGuard(ListCpusPage);
