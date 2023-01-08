import 'reflect-metadata';
import { ImportPartsDialog } from '@client/admin/components/part/import-parts-dialog';
import { partService } from '@client/part';
import {
  Alert,
  AlertVariant,
  Button,
  ButtonVariant,
  Checkbox,
  Field,
  File,
  showDialog,
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
import React, { useCallback, useMemo, useState } from 'react';
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
  const exportList = useMemo(() => new Set<number>(), []);

  const handleImportFileChange = useCallback((file: File) => {
    setImportFile(file);
  }, []);

  const handleImportClick = useCallback(async () => {
    showDialog(<ImportPartsDialog file={importFile} />, {
      disableClose: true,
    });
  }, [importFile]);

  const handleExportToggle = useCallback(
    async (id: number, checked: boolean) => {
      if (checked) {
        exportList.add(id);
      } else {
        exportList.delete(id);
      }
    },
    [exportList],
  );

  const handleExportClick = useCallback(async () => {
    const result = await partService.export({ ids: [...exportList.values()] });
    downloadExportFile(result);
  }, [exportList]);

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
          <h2>Import GPUs</h2>

          <Field className="flex-1">
            <div className="flex gap-4">
              <File
                name="file"
                onChange={handleImportFileChange}
                className="flex-1"
              />

              <Button
                variant={ButtonVariant.Secondary}
                onClick={handleImportClick}
              >
                Import
              </Button>
            </div>
          </Field>
        </section>

        <section>
          <h2>All GPUs</h2>

          {gpus.length > 0 && (
            <div className="flex flex-col gap-4">
              <Table border responsive>
                <THead>
                  <Tr className="font-medium">
                    <Th className="w-10"></Th>
                    <Th className="text-left">ID</Th>
                    <Th>Name</Th>
                  </Tr>
                </THead>
                <TBody>
                  {gpus.map((gpu) => (
                    <Tr key={gpu.id}>
                      <Td>
                        <Checkbox
                          onChange={(checked) =>
                            handleExportToggle(gpu.id, checked)
                          }
                        />
                      </Td>
                      <Td className="text-left">{gpu.id}</Td>
                      <Td>
                        <a href={`/admin/gpus/${gpu.id}`}>{gpu.name}</a>
                      </Td>
                    </Tr>
                  ))}
                </TBody>
              </Table>

              <div className="flex justify-end">
                <Button
                  variant={ButtonVariant.Primary}
                  onClick={() => handleExportClick()}
                >
                  Export
                </Button>
              </div>
            </div>
          )}

          {gpus.length === 0 && (
            <Alert variant={AlertVariant.Info}>There are no GPUs.</Alert>
          )}
        </section>
      </article>
    </AdminLayout>
  );
};
