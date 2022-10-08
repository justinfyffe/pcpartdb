import 'reflect-metadata';
import { NextPageContext } from 'next';
import React from 'react';
import { Image } from '../../../../shared/image';
import { withStaffGuard } from '../../../auth/with-staff-guard';
import { imageService } from '../../../image/image.service';
import { Article, ArticleHeader } from '../../../shared/components/article';
import { Button, ButtonVariant } from '../../../shared/components/button';
import { AdminLayout } from '../../../shared/layouts/admin';
import { ImageForm } from '../../components';

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
