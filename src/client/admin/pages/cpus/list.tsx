import 'reflect-metadata';
import React from 'react';
import { withStaffGuard } from '../../../auth/with-staff-guard';
import { Article, ArticleHeader } from '../../../shared/components/article';
import { AdminLayout } from '../../../shared/layouts/admin';

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
