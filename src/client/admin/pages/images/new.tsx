import 'reflect-metadata';
import React from 'react';
import { withStaffGuard } from '../../../auth/with-staff-guard';
import { Article, ArticleHeader } from '../../../shared/components/article';
import { Button, ButtonVariant } from '../../../shared/components/button';
import { AdminLayout } from '../../../shared/layouts/admin';
import { ImageForm } from '../../components';

interface NewImagePageProps {}

const NewImagePage = (_props: NewImagePageProps) => {
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

export const AdminNewImagePage = withStaffGuard(NewImagePage);
