import 'reflect-metadata';
import React from 'react';
import { withStaffGuard } from '../../../auth/with-staff-guard';
import { Article, ArticleHeader } from '../../../shared/components/article';
import { Button, ButtonVariant } from '../../../shared/components/button';
import { AdminLayout } from '../../../shared/layouts/admin';
import { GpuForm } from '../../components';

interface NewGpuPageProps {}

const NewGpuPage = (_props: NewGpuPageProps) => {
  return (
    <AdminLayout>
      <Article>
        <ArticleHeader>
          <h1>GPUs - New GPU</h1>

          <Button href="/admin/gpus" variant={ButtonVariant.Default}>
            Back
          </Button>
        </ArticleHeader>

        <GpuForm />
      </Article>
    </AdminLayout>
  );
};

export const AdminNewGpuPage = withStaffGuard(NewGpuPage);
