import 'reflect-metadata';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { withStaffGuard } from '../../../client/auth/with-staff-guard';
import { imageService } from '../../../client/image/image.service';
import {
  formatDimensions,
  formatFileSize,
  getImageUrl,
} from '../../../client/image/image.utils';
import { Alert, AlertVariant } from '../../../client/shared/components/alert';
import {
  Article,
  ArticleHeader,
} from '../../../client/shared/components/article';
import {
  Button,
  ButtonVariant,
} from '../../../client/shared/components/button';
import { Img } from '../../../client/shared/components/image';
import { TextInput } from '../../../client/shared/components/input';
import {
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from '../../../client/shared/components/table';
import { AdminLayout } from '../../../client/shared/layouts/admin';
import { Image } from '../../../shared/image';

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

AdminImagesPage.getInitialProps = async () => {
  const images = await imageService.list();
  return { images: images || [] };
};

export default withStaffGuard(AdminImagesPage);
