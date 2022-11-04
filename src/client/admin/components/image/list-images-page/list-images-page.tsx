import 'reflect-metadata';
import { formatDimensions, formatFileSize, getImageUrl } from '@client/image';
import {
  Alert,
  AlertVariant,
  Article,
  ArticleHeader,
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
      <Article>
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

        <ArticleHeader>
          <h1>Images</h1>

          <Button href="/admin/images/new" variant={ButtonVariant.Default}>
            Add
          </Button>
        </ArticleHeader>

        {images.length > 0 && (
          <Table border>
            <THead>
              <Tr>
                <Th className="max-w-[200px]">Preview</Th>
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
                  <Td className="max-w-[200px]">
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
      </Article>
    </AdminLayout>
  );
};
