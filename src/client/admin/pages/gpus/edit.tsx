import 'reflect-metadata';
import { NextPageContext } from 'next';
import React from 'react';
import { Product } from '../../../../shared/product';
import { withStaffGuard } from '../../../auth/with-staff-guard';
import { productService } from '../../../product/product.service';
import { Article, ArticleHeader } from '../../../shared/components/article';
import { Button, ButtonVariant } from '../../../shared/components/button';
import { AdminLayout } from '../../../shared/layouts/admin';
import { GpuForm } from '../../components';

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
