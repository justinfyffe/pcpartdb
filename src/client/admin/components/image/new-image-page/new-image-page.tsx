import 'reflect-metadata';
import { withStaffGuard } from '@client/auth';
import {
  Article,
  ArticleHeader,
  Button,
  ButtonVariant,
} from '@client/shared/components';
import { AdminLayout } from '@client/shared/layouts';
import React from 'react';
import { ImageForm } from '../image-form';

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
