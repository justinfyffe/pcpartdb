import 'reflect-metadata';
import {
  AdminListImagesViewModel,
  getAdminEditImagePath,
  getAdminNewImagePath,
} from '@pcpartdb/shared';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import {
  formatFileSize,
  formatImageDimensions,
  getImagePath,
} from '../../../image';
import {
  Button,
  ButtonVariant,
  Img,
  MetaRobots,
  Seo,
  Table,
  TBody,
  Td,
  TextInput,
  Th,
  THead,
  Tr,
} from '../../../shared/components';
import { Alert, AlertVariant } from '../../../shared/components/Alert';
import { AdminLayout } from '../../../shared/layouts';

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
          {saved && (
            <Alert variant={AlertVariant.Success}>
              The image has been saved.
            </Alert>
          )}

          {deleted && (
            <Alert variant={AlertVariant.Success}>
              The image has been deleted.
            </Alert>
          )}
        </section>

        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold">{pageTitle}</h1>

          <Button href={getAdminNewImagePath()} variant={ButtonVariant.Generic}>
            Add
          </Button>
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

          {images.length === 0 && (
            <Alert variant={AlertVariant.Info}>There are no images.</Alert>
          )}
        </section>
      </article>
    </AdminLayout>
  );
};
