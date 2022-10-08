import 'reflect-metadata';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { withStaffGuard } from '../../../client/auth/with-staff-guard';
import { productService } from '../../../client/product/product.service';
import { Alert, AlertVariant } from '../../../client/shared/components/alert';
import {
  Article,
  ArticleHeader,
} from '../../../client/shared/components/article';
import {
  Button,
  ButtonVariant,
} from '../../../client/shared/components/button';
import {
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from '../../../client/shared/components/table';
import { AdminLayout } from '../../../client/shared/layouts/admin';
import { Product } from '../../../shared/product';

interface AdminGpusPageProps {
  gpus: Product[];
}

const AdminGpusPage = (props: AdminGpusPageProps) => {
  const { gpus } = props;
  const router = useRouter();
  const [saved] = useState(router.query.saved === 'true');
  const [deleted] = useState(router.query.deleted === 'true');

  return (
    <AdminLayout>
      <Article>
        {saved && (
          <Alert variant={AlertVariant.Success}>The GPU has been saved.</Alert>
        )}

        {deleted && (
          <Alert variant={AlertVariant.Success}>
            The GPU has been deleted.
          </Alert>
        )}

        <ArticleHeader>
          <h1>GPUs</h1>

          <Button href="/admin/gpus/new" variant={ButtonVariant.Default}>
            Add
          </Button>
        </ArticleHeader>

        {gpus.length > 0 && (
          <Table border responsive>
            <THead>
              <Tr className="font-medium">
                <Th className="text-center">ID</Th>
                <Th>Name</Th>
              </Tr>
            </THead>
            <TBody>
              {gpus.map((gpu) => (
                <Tr key={gpu.id}>
                  <Td className="text-center">{gpu.id}</Td>
                  <Td>
                    <a href={`/admin/gpus/${gpu.id}`}>{gpu.name}</a>
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        )}

        {gpus.length === 0 && (
          <Alert variant={AlertVariant.Info}>There are no GPUs.</Alert>
        )}
      </Article>
    </AdminLayout>
  );
};

AdminGpusPage.getInitialProps = async () => {
  const gpus = await productService.list();
  return { gpus: gpus || [] };
};

export default withStaffGuard(AdminGpusPage);
