import 'reflect-metadata';
import {
  Article,
  ArticleHeader,
  Button,
  ButtonVariant,
} from '@client/shared/components';
import { AdminLayout } from '@client/shared/layouts';
import { Image } from '@shared/image';
import React from 'react';
import { ImageForm } from '../image-form';

export interface AdminEditImagePageProps {
  image: Image;
}

export const AdminEditImagePage = (props: AdminEditImagePageProps) => {
  return (
    <AdminLayout>
      <Article>
        <ArticleHeader>
          <h1>Images - Edit Image</h1>

          <Button href="/admin/images" variant={ButtonVariant.Default}>
            Back
          </Button>
        </ArticleHeader>

        <ImageForm image={props.image} />
      </Article>
    </AdminLayout>
  );
};
