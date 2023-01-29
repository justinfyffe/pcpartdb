import 'reflect-metadata';
import {
  Alert,
  AlertVariant,
  Button,
  ButtonVariant,
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from '@client/shared/components';
import { AdminLayout } from '@client/shared/layouts';
import { Gpu } from '@shared/gpus';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

export interface AdminListGpusPageProps {
  gpus: Gpu[];
}

export const AdminListGpusPage = (props: AdminListGpusPageProps) => {
  const { gpus } = props;
  const router = useRouter();
  const [saved] = useState(router.query.saved === 'true');
  const [deleted] = useState(router.query.deleted === 'true');

  return (
    <AdminLayout>
      <article>
        <section>
          {saved && (
            <Alert variant={AlertVariant.Success}>
              The GPU has been saved.
            </Alert>
          )}

          {deleted && (
            <Alert variant={AlertVariant.Success}>
              The GPU has been deleted.
            </Alert>
          )}
        </section>

        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold">GPUs</h1>

          <Button href="/admin/gpus/new" variant={ButtonVariant.Default}>
            Add
          </Button>
        </div>

        <section>
          {gpus.length > 0 && (
            <Table border responsive>
              <THead>
                <Tr className="font-medium">
                  <Th className="text-left">ID</Th>
                  <Th>Name</Th>
                </Tr>
              </THead>
              <TBody>
                {gpus.map((gpu) => (
                  <Tr key={gpu.id}>
                    <Td className="text-left">{gpu.id}</Td>
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
        </section>
      </article>
    </AdminLayout>
  );
};
