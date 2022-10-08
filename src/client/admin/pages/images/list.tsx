import 'reflect-metadata';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Image } from '../../../../shared/image';
import { withStaffGuard } from '../../../auth/with-staff-guard';
import { imageService } from '../../../image/image.service';
import {
  formatDimensions,
  formatFileSize,
  getImageUrl,
} from '../../../image/image.utils';
import { Alert, AlertVariant } from '../../../shared/components/alert';
import { Article, ArticleHeader } from '../../../shared/components/article';
import { Button, ButtonVariant } from '../../../shared/components/button';
import { Img } from '../../../shared/components/image';
import { TextInput } from '../../../shared/components/input';
import {
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from '../../../shared/components/table';
import { AdminLayout } from '../../../shared/layouts/admin';

interface ListImagesPageProps {
  images: Image[];
}

const ListImagesPage = (props: ListImagesPageProps) => {
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

ListImagesPage.getInitialProps = async () => {
  const images = await imageService.list();
  return { images: images || [] };
};

export const AdminListImagesPage = withStaffGuard(ListImagesPage);
