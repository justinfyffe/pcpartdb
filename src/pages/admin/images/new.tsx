import 'reflect-metadata';
import React from 'react';
import { withStaffGuard } from '../../../web/auth/with-staff-guard';
import { ImageForm } from '../../../web/image/components/image-form';
import { Article, ArticleHeader } from '../../../web/shared/components/article';
import { Button, ButtonVariant } from '../../../web/shared/components/button';
import { AdminLayout } from '../../../web/shared/layouts/admin';

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
