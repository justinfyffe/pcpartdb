import 'reflect-metadata';
import React from 'react';
import { withStaffGuard } from '../../../client/auth/with-staff-guard';
import { GpuForm } from '../../../client/product/components/gpu-form';
import {
  Article,
  ArticleHeader,
} from '../../../client/shared/components/article';
import {
  Button,
  ButtonVariant,
} from '../../../client/shared/components/button';
import { AdminLayout } from '../../../client/shared/layouts/admin';

interface AdminNewGpuPageProps {}

const AdminNewGpuPage = (_props: AdminNewGpuPageProps) => {
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

export default withStaffGuard(AdminNewGpuPage);
