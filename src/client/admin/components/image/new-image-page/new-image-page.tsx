import 'reflect-metadata';
import {
  Article,
  ArticleHeader,
  Button,
  ButtonVariant,
} from '@client/shared/components';
import { AdminLayout } from '@client/shared/layouts';
import React from 'react';
import { ImageForm } from '../image-form';

interface AdminNewImagePageProps {}

export const AdminNewImagePage = (_props: AdminNewImagePageProps) => {
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
