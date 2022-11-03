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
import { GpuForm } from '../gpu-form';

interface AdminNewGpuPageProps {}

const NewGpuPage = (_props: AdminNewGpuPageProps) => {
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
