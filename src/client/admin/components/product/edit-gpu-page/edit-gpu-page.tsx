import 'reflect-metadata';
import { withStaffGuard } from '@client/auth';
import { productService } from '@client/product';
import {
  Article,
  ArticleHeader,
  Button,
  ButtonVariant,
} from '@client/shared/components';
import { AdminLayout } from '@client/shared/layouts';
import { Product } from '@shared/product';
import { NextPageContext } from 'next';
import React from 'react';
import { GpuForm } from '../gpu-form';

interface EditGpuPageProps {
  gpu: Product;
}

const EditGpuPage = (props: EditGpuPageProps) => {
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

EditGpuPage.getInitialProps = async (ctx: NextPageContext) => {
  const query = ctx.query as { gpuId: string };
  const gpuId = parseInt(query.gpuId, 10);

  return {
    gpu: await productService.get(gpuId),
  };
};

export const AdminEditGpuPage = withStaffGuard(EditGpuPage);
