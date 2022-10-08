import 'reflect-metadata';
import { NextPageContext } from 'next';
import React from 'react';
import { withStaffGuard } from '../../../client/auth/with-staff-guard';
import { ImageForm } from '../../../client/image/components/image-form';
import { imageService } from '../../../client/image/image.service';
import {
  Article,
  ArticleHeader,
} from '../../../client/shared/components/article';
import {
  Button,
  ButtonVariant,
} from '../../../client/shared/components/button';
import { AdminLayout } from '../../../client/shared/layouts/admin';
import { Image } from '../../../shared/image';

interface AdminEditImagePageProps {
  image: Image;
}

const AdminEditImagePage = (props: AdminEditImagePageProps) => {
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

AdminEditImagePage.getInitialProps = async (ctx: NextPageContext) => {
  const query = ctx.query as { imageId: string };
  const imageId = parseInt(query.imageId, 10);

  return {
    image: await imageService.get(imageId),
  };
};

export default withStaffGuard(AdminEditImagePage);
