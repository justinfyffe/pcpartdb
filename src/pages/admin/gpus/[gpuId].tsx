import 'reflect-metadata';
import { NextPageContext } from 'next';
import React from 'react';
import { withStaffGuard } from '../../../web/auth/with-staff-guard';
import { Article, ArticleHeader } from '../../../web/shared/components/article';
import { Button, ButtonVariant } from '../../../web/shared/components/button';
import { AdminLayout } from '../../../web/shared/layouts/admin';

interface AdminEditGpuPageProps {}

const AdminEditGpuPage = (_props: AdminEditGpuPageProps) => {
  return (
    <AdminLayout>
      <Article>
        <ArticleHeader>
          <h1>GPUs - Edit GPU</h1>

          <Button href="/admin/gpus" variant={ButtonVariant.Default}>
            Back
          </Button>
        </ArticleHeader>
      </Article>
    </AdminLayout>
  );
};

AdminEditGpuPage.getInitialProps = async (ctx: NextPageContext) => {
  const query = ctx.query as { gpuId: string };
  const gpuId = parseInt(query.gpuId, 10);

  return {};
};

export default withStaffGuard(AdminEditGpuPage);
