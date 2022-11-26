import 'reflect-metadata';
import { formatDimensions, formatFileSize, getImageUrl } from '@client/image';
import {
  Alert,
  AlertVariant,
  Button,
  ButtonVariant,
  Img,
  Table,
  TBody,
  Td,
  TextInput,
  Th,
  THead,
  Tr,
} from '@client/shared/components';
import { AdminLayout } from '@client/shared/layouts';
import { Image } from '@shared/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

export interface AdminListImagesPageProps {
  images: Image[];
}

export const AdminListImagesPage = (props: AdminListImagesPageProps) => {
  const { images } = props;

  const router = useRouter();
  const [saved] = useState(router.query.saved === 'true');
  const [deleted] = useState(router.query.deleted === 'true');

  return (
    <AdminLayout>
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
          <h1 className="font-semibold">Images</h1>

          <Button href="/admin/images/new" variant={ButtonVariant.Default}>
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
                      <a href={`/admin/images/${image.id}`}>{image.name}</a>
                    </Td>
                    <Td>
                      <TextInput value={getImageUrl(image)} disabled />
                    </Td>
                    <Td>{formatFileSize(image.fileSize)}</Td>
                    <Td>{formatDimensions(image.width, image.height)}</Td>
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
