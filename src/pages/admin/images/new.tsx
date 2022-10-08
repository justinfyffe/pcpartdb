import 'reflect-metadata';
import React from 'react';
import { withStaffGuard } from '../../../client/auth/with-staff-guard';
import { ImageForm } from '../../../client/image/components/image-form';
import {
  Article,
  ArticleHeader,
} from '../../../client/shared/components/article';
import {
  Button,
  ButtonVariant,
} from '../../../client/shared/components/button';
import { AdminLayout } from '../../../client/shared/layouts/admin';

interface AdminNewImagePageProps {}

const AdminNewImagePage = (_props: AdminNewImagePageProps) => {
  return (
    <AdminLayout>
      <Article>
        <ArticleHeader>
          <h1>Images - Upload Image</h1>

          <Button href="/admin/images" variant={ButtonVariant.Default}>
            Back
          </Button>
        </ArticleHeader>

        <ImageForm />
      </Article>
    </AdminLayout>
  );
};

export default withStaffGuard(AdminNewImagePage);
