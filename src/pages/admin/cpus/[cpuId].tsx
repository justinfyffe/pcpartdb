import 'reflect-metadata';
import { NextPageContext } from 'next';
import React from 'react';
import { withStaffGuard } from '../../../web/auth/with-staff-guard';
import { Article, ArticleHeader } from '../../../web/shared/components/article';
import { Button, ButtonVariant } from '../../../web/shared/components/button';
import { AdminLayout } from '../../../web/shared/layouts/admin';

interface AdminEditCpuPageProps {}

const AdminEditCpuPage = (_props: AdminEditCpuPageProps) => {
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

AdminEditCpuPage.getInitialProps = async (ctx: NextPageContext) => {
  const query = ctx.query as { cpuId: string };
  const cpuId = parseInt(query.cpuId, 10);

  return {};
};

export default withStaffGuard(AdminEditCpuPage);
