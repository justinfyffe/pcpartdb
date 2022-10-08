import 'reflect-metadata';
import React from 'react';
import { withStaffGuard } from '../../../auth/with-staff-guard';
import { Article, ArticleHeader } from '../../../shared/components/article';
import { Button, ButtonVariant } from '../../../shared/components/button';
import { AdminLayout } from '../../../shared/layouts/admin';

interface NewCpuPageProps {}

const NewCpuPage = (_props: NewCpuPageProps) => {
  return (
    <AdminLayout>
      <Article>
        <ArticleHeader>
          <h1>CPUs - New CPU</h1>

          <Button href="/admin/cpus" variant={ButtonVariant.Default}>
            Back
          </Button>
        </ArticleHeader>
      </Article>
    </AdminLayout>
  );
};

export const AdminNewCpuPage = withStaffGuard(NewCpuPage);
