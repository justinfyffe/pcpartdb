import 'reflect-metadata';
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

export const AdminNewGpuPage = (_props: AdminNewGpuPageProps) => {
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
