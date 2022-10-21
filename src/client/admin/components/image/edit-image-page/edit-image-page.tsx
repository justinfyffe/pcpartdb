import 'reflect-metadata';
import { withStaffGuard } from '@client/auth';
import { imageService } from '@client/image';
import {
  Article,
  ArticleHeader,
  Button,
  ButtonVariant,
} from '@client/shared/components';
import { AdminLayout } from '@client/shared/layouts';
import { Image } from '@shared/image';
import { NextPageContext } from 'next';
import React from 'react';
import { ImageForm } from '../image-form';

interface EditImagePageProps {
  image: Image;
}

const EditImagePage = (props: EditImagePageProps) => {
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

EditImagePage.getInitialProps = async (ctx: NextPageContext) => {
  const query = ctx.query as { imageId: string };
  const imageId = parseInt(query.imageId, 10);

  return {
    image: await imageService.get(imageId),
  };
};

export const AdminEditImagePage = withStaffGuard(EditImagePage);
