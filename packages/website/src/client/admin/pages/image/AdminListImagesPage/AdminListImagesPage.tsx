import 'reflect-metadata';
import {
  AdminListImagesViewModel,
  getAdminEditImagePath,
  getAdminNewImagePath,
} from '@pcpartdb/shared';
import { useRouter } from 'next/router';
import { InfoAlert } from 'packages/website/src/client/shared/components/Alert/InfoAlert';
import { SuccessAlert } from 'packages/website/src/client/shared/components/Alert/SuccessAlert';
import { GenericButton } from 'packages/website/src/client/shared/components/Button/GenericButton';
import { Img } from 'packages/website/src/client/shared/components/Img/Img';
import { TextInput } from 'packages/website/src/client/shared/components/Input/TextInput';
import {
  MetaRobots,
  Seo,
} from 'packages/website/src/client/shared/components/Seo/Seo';
import { AdminLayout } from 'packages/website/src/client/shared/layouts/admin/AdminLayout';
import React, { useState } from 'react';
import {
  formatFileSize,
  formatImageDimensions,
  getImagePath,
} from '../../../../image/utils';
import { Table, TBody, Td, Th, THead, Tr } from '../../../../shared/components';

export const AdminListImagesPage = (props: AdminListImagesViewModel) => {
  const { images } = props;

  const router = useRouter();
  const [saved] = useState(router.query.saved === 'true');
  const [deleted] = useState(router.query.deleted === 'true');

  const pageTitle = 'Images';
  const seoTitle = `${pageTitle} - Admin Panel`;
  const seoRobots = [MetaRobots.NOINDEX, MetaRobots.NOFOLLOW];

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

        <section>
          {images.length > 0 && (
            <Table border>
              <THead>
                <Tr>
                  <Th className="max-w-50">Preview</Th>
                  <Th className="text-center">ID</Th>
                  <Th>Name</Th>
                  <Th>Path</Th>
                  <Th>Size</Th>
                  <Th>Dimensions</Th>
                </Tr>
              </THead>
              <TBody>
                {images.map((image) => (
                  <Tr key={image.id}>
                    <Td className="max-w-50">
                      <Img src={image} alt={image.name} />
                    </Td>
                    <Td className="text-center">{image.id}</Td>
                    <Td>
                      <a href={getAdminEditImagePath(image)}>{image.name}</a>
                    </Td>
                    <Td>
                      <TextInput value={getImagePath(image)} disabled />
                    </Td>
                    <Td>{formatFileSize(image.fileSize)}</Td>
                    <Td>{formatImageDimensions(image.width, image.height)}</Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          )}

          {images.length === 0 && <InfoAlert>There are no images.</InfoAlert>}
        </section>
      </article>
    </AdminLayout>
  );
};
