import 'reflect-metadata';
import { withStaffGuard } from '@client/auth';
import {
  Article,
  ArticleHeader,
  Button,
  ButtonVariant,
} from '@client/shared/components';
import { AdminLayout } from '@client/shared/layouts';
import React from 'react';

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
