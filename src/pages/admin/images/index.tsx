import 'reflect-metadata';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Image } from '../../../types/image';
import { withStaffGuard } from '../../../web/auth/with-staff-guard';
import {
  formatDimensions,
  formatFileSize,
  getImageUrl,
} from '../../../web/image/image.utils';
import { Alert, AlertVariant } from '../../../web/shared/components/alert';
import { Article, ArticleHeader } from '../../../web/shared/components/article';
import { Button, ButtonVariant } from '../../../web/shared/components/button';
import { Img } from '../../../web/shared/components/image';
import { Input } from '../../../web/shared/components/input';
import {
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from '../../../web/shared/components/table';
import { AdminLayout } from '../../../web/shared/layouts/admin';

interface AdminImagesPageProps {
  images: Image[];
}

const AdminImagesPage = (props: AdminImagesPageProps) => {
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
          <Table>
            <THead>
              <Tr>
                <Th>Preview</Th>
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
                  <Td className="text-center preview-image">
                    <Img src={image} alt={image.name} />
                  </Td>
                  <Td className="text-center">{image.id}</Td>
                  <Td>
                    <a href={`/admin/images/${image.id}`}>{image.name}</a>
                  </Td>
                  <Td>
                    <Input value={getImageUrl(image)} disabled />
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

export default withStaffGuard(AdminImagesPage);
