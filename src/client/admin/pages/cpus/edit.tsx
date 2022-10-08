import 'reflect-metadata';
import { NextPageContext } from 'next';
import React from 'react';
import { withStaffGuard } from '../../../auth/with-staff-guard';
import { Article, ArticleHeader } from '../../../shared/components/article';
import { Button, ButtonVariant } from '../../../shared/components/button';
import { AdminLayout } from '../../../shared/layouts/admin';

interface EditCpuPageProps {}

const EditCpuPage = (_props: EditCpuPageProps) => {
  return (
    <AdminLayout>
      <Article>
        <ArticleHeader>
          <h1>CPUs - Edit CPU</h1>

          <Button href="/admin/cpus" variant={ButtonVariant.Default}>
            Back
          </Button>
        </ArticleHeader>
      </Article>
    </AdminLayout>
  );
};

EditCpuPage.getInitialProps = async (_ctx: NextPageContext) => {
  // const query = ctx.query as { cpuId: string };
  // const cpuId = parseInt(query.cpuId, 10);

  return {};
};

export const AdminEditCpuPage = withStaffGuard(EditCpuPage);
