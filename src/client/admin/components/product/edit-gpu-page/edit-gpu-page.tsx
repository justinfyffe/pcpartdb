import 'reflect-metadata';
import {
  Article,
  ArticleHeader,
  Button,
  ButtonVariant,
} from '@client/shared/components';
import { AdminLayout } from '@client/shared/layouts';
import { Product } from '@shared/product';
import React from 'react';
import { GpuForm } from '../gpu-form';

export interface AdminEditGpuPageProps {
  gpu: Product;
}

export const AdminEditGpuPage = (props: AdminEditGpuPageProps) => {
  const { gpu } = props;

  return (
    <AdminLayout>
      <Article>
        <ArticleHeader>
          <h1>GPUs - Edit GPU</h1>

          <Button href="/admin/gpus" variant={ButtonVariant.Default}>
            Back
          </Button>
        </ArticleHeader>

        <GpuForm gpu={gpu} />
      </Article>
    </AdminLayout>
  );
};
