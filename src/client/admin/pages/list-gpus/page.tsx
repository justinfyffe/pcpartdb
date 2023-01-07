import 'reflect-metadata';
import { partService } from '@client/part';
import {
  Alert,
  AlertVariant,
  Button,
  ButtonVariant,
  Field,
  File,
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from '@client/shared/components';
import { AdminLayout } from '@client/shared/layouts';
import { Part } from '@shared/part';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import { downloadExportFile } from './export-utils';

export interface AdminListGpusPageProps {
  gpus: Part[];
}

export const AdminListGpusPage = (props: AdminListGpusPageProps) => {
  const { gpus } = props;
  const router = useRouter();
  const [saved] = useState(router.query.saved === 'true');
  const [deleted] = useState(router.query.deleted === 'true');
  const [importFile, setImportFile] = useState<File>(null);

  const handleImportFileChange = useCallback((file: File) => {
    setImportFile(file);
  }, []);

  const handleImportClick = useCallback(async () => {
    await partService.importFromFile(importFile);
  }, [importFile]);

  const handleExportClick = useCallback(async (id: number) => {
    const result = await partService.export({ id });
    downloadExportFile(result);
  }, []);

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

        <section className="border-b-px border-b-slate-300 mb-6">
          <Field className="flex-1 mx-2">
            Import Part
            <File name="file" onChange={handleImportFileChange} />
            <Button
              variant={ButtonVariant.Secondary}
              onClick={handleImportClick}
            >
              Import
            </Button>
          </Field>
        </section>

        <section>
          <h2>All GPUs</h2>

          {gpus.length > 0 && (
            <Table border responsive>
              <THead>
                <Tr className="font-medium">
                  <Th className="text-center">ID</Th>
                  <Th>Name</Th>
                  <Th>Export</Th>
                </Tr>
              </THead>
              <TBody>
                {gpus.map((gpu) => (
                  <Tr key={gpu.id}>
                    <Td className="text-center">{gpu.id}</Td>
                    <Td>
                      <a href={`/admin/gpus/${gpu.id}`}>{gpu.name}</a>
                    </Td>
                    <Td>
                      <a
                        onClick={() => handleExportClick(gpu.id)}
                        className="cursor-pointer"
                      >
                        Export
                      </a>
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
