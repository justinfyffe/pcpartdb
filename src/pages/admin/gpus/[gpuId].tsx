import 'reflect-metadata';
import { NextPageContext } from 'next';
import React from 'react';
import { Product } from '../../../types/product';
import { withStaffGuard } from '../../../web/auth/with-staff-guard';
import { GpuForm } from '../../../web/product/components/gpu-form';
import { productService } from '../../../web/product/product.service';
import { Article, ArticleHeader } from '../../../web/shared/components/article';
import { Button, ButtonVariant } from '../../../web/shared/components/button';
import { AdminLayout } from '../../../web/shared/layouts/admin';

interface AdminEditGpuPageProps {
  gpu: Product;
}

const AdminEditGpuPage = (props: AdminEditGpuPageProps) => {
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

AdminEditGpuPage.getInitialProps = async (ctx: NextPageContext) => {
  const query = ctx.query as { gpuId: string };
  const gpuId = parseInt(query.gpuId, 10);

  return {
    gpu: await productService.get(gpuId),
  };
};

export default withStaffGuard(AdminEditGpuPage);
