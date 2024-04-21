import 'reflect-metadata';
import {
  getAdminEditImagePath,
  getAdminNewImagePath,
  Image,
} from '@pcpartdb/shared';
import { useRouter } from 'next/router';
import { SuccessAlert } from 'packages/website/src/client/shared/components/Alert/SuccessAlert';
import { GenericButton } from 'packages/website/src/client/shared/components/Button/GenericButton';
import {
  MetaRobots,
  Seo,
} from 'packages/website/src/client/shared/components/Seo/Seo';
import { AdminLayout } from 'packages/website/src/client/shared/layouts/admin/AdminLayout';
import React, { useCallback, useState } from 'react';
import { ImagesList } from '../../../components/image/ImagesList/ImagesList';

export const AdminListImagesPage = () => {
  const router = useRouter();
  const [saved] = useState(router.query.saved === 'true');
  const [deleted] = useState(router.query.deleted === 'true');

  const pageTitle = 'Images';
  const seoTitle = `${pageTitle} - Admin Panel`;
  const seoRobots = [MetaRobots.NOINDEX, MetaRobots.NOFOLLOW];

  const handleSelection = useCallback(
    (image: Image) => {
      router.push(getAdminEditImagePath(image));
    },
    [router],
  );

  return (
    <AdminLayout>
      <Seo title={seoTitle} robots={seoRobots} />

      <article>
        <section>
          {saved && <SuccessAlert>The image has been saved.</SuccessAlert>}

          {deleted && <SuccessAlert>The image has been deleted.</SuccessAlert>}
        </section>

        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold">{pageTitle}</h1>

          <GenericButton href={getAdminNewImagePath()}>Add</GenericButton>
        </div>

        <ImagesList onSelect={handleSelection} />
      </article>
    </AdminLayout>
  );
};
