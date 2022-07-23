import 'reflect-metadata';
import { NextPageContext } from 'next';
import React from 'react';
import { Image } from '../../../types/image';
import { withStaffGuard } from '../../../web/auth/with-staff-guard';
import { ImageForm } from '../../../web/image/components/image-form';
import { imageService } from '../../../web/image/image.service';
import { Article, ArticleHeader } from '../../../web/shared/components/article';
import { Button, ButtonVariant } from '../../../web/shared/components/button';
import { AdminLayout } from '../../../web/shared/layouts/admin';

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
