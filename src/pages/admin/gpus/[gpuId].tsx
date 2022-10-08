import 'reflect-metadata';
import { NextPageContext } from 'next';
import React from 'react';
import { withStaffGuard } from '../../../client/auth/with-staff-guard';
import { GpuForm } from '../../../client/product/components/gpu-form';
import { productService } from '../../../client/product/product.service';
import {
  Article,
  ArticleHeader,
} from '../../../client/shared/components/article';
import {
  Button,
  ButtonVariant,
} from '../../../client/shared/components/button';
import { AdminLayout } from '../../../client/shared/layouts/admin';
import { Product } from '../../../shared/product';

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
