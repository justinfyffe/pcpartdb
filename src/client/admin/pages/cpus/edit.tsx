import 'reflect-metadata';
import { withStaffGuard } from '@client/auth';
import {
  Article,
  ArticleHeader,
  Button,
  ButtonVariant,
} from '@client/shared/components';
import { AdminLayout } from '@client/shared/layouts';
import { NextPageContext } from 'next';
import React from 'react';

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
