import 'reflect-metadata';
import {
  ApiError,
  getAdminListGpusPath,
  getViewGpuPath,
  Gpu,
} from '@pcpartdb/shared';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo, useState } from 'react';
import { getGpuName, gpuService } from '../../../gpus';
import {
  Alert,
  AlertVariant,
  Button,
  ButtonVariant,
  Checkbox,
  Field,
  FieldHint,
  File,
  showDialog,
  Spinner,
  Table,
  TBody,
  Td,
  Tr,
} from '../../../shared/components';
import { AdminLayout } from '../../../shared/layouts';
import { PreviewDialog } from './components';

interface AdminImportGpusPageProps {}

export const AdminImportGpusPage = (_props: AdminImportGpusPageProps) => {
  const [newGpus, setNewGpus] = useState<Gpu[]>([]);
  const [existingGpus, setExistingGpus] = useState<Gpu[]>([]);
  const [gpusToImportMap, setGpusToImportMap] = useState(
    {} as Record<string, Gpu>,
  );

  const router = useRouter();
  const [importing, setImporting] = useState(false);
  const [requestError, setRequestError] = useState<ApiError>(null);

  const hasData = newGpus.length > 0 || existingGpus.length > 0;
  const gpusToImport = useMemo(
    () => Object.values(gpusToImportMap).filter((gpu) => gpu != null),
    [gpusToImportMap],
  );

  const handleFileChange = useCallback(async (file: File) => {
    const results = await gpuService.previewImportGpus(file);

    setNewGpus(results.newGpus);
    setExistingGpus(results.existingGpus);

    setGpusToImportMap(
      results.newGpus.reduce((acc, gpu) => {
        acc[gpu.slug] = gpu;
        return acc;
      }, {} as Record<string, Gpu>),
    );
  }, []);

  const handlePreviewGpu = useCallback((gpu: Gpu) => {
    showDialog(<PreviewDialog gpu={gpu} />);
  }, []);

  const handleImportCheck = useCallback(
    (gpu: Gpu, checked: boolean) => {
      if (checked) {
        gpusToImportMap[gpu.slug] = gpu;
        setGpusToImportMap({ ...gpusToImportMap });
      } else {
        delete gpusToImportMap[gpu.slug];
        setGpusToImportMap({ ...gpusToImportMap });
      }
    },
    [gpusToImportMap],
  );

  const handleImportClicked = useCallback(async () => {
    setImporting(true);

    try {
      await gpuService.importGpus({ gpus: gpusToImport });

      router.push('/admin/gpus');
    } catch (err) {
      console.log(err);
      setRequestError(err as ApiError);
    } finally {
      setImporting(false);
    }
    await gpuService.importGpus({ gpus: gpusToImport });
  }, [gpusToImport, router]);

  return (
    <AdminLayout>
      <article>
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold">GPUs - Import</h1>

          <Button href={getAdminListGpusPath()} variant={ButtonVariant.Default}>
            Back
          </Button>
        </div>

        <Field className="flex-1 mx-2">
          File
          <File name="file" onChange={handleFileChange} />
          <FieldHint className="flex justify-between">
            Upload results from scraping tool
          </FieldHint>
        </Field>

        {requestError && (
          <Alert variant={AlertVariant.Error}>
            An unknown error has occurred. Please try again later.
          </Alert>
        )}

        {hasData && (
          <div className="flex flex-col mt-8 gap-4">
            <h2 className="mb-0">Preview</h2>

            <div className="flex gap-4">
              <section className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="mb-0">New GPUs</h3>
                  <span>{newGpus.length} GPUs</span>
                </div>

                <Table>
                  <TBody>
                    {newGpus.map((gpu) => (
                      <Tr key={gpu.name}>
                        <Td>
                          <a
                            onClick={() => handlePreviewGpu(gpu)}
                            className="cursor-pointer"
                          >
                            {getGpuName(gpu)}
                          </a>
                        </Td>
                        <Td className="text-right">
                          <Checkbox
                            value={gpusToImportMap[gpu.slug] != null}
                            onChange={(checked) =>
                              handleImportCheck(gpu, checked)
                            }
                          />
                        </Td>
                      </Tr>
                    ))}
                  </TBody>
                </Table>
              </section>

              <section className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="mb-0">Existing GPUs</h3>
                  <span>{existingGpus.length} GPUs</span>
                </div>

                <Table>
                  <TBody>
                    {existingGpus.map((gpu) => (
                      <Tr key={gpu.slug}>
                        <Td>
                          <a
                            href={getViewGpuPath(gpu)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {getGpuName(gpu)}
                          </a>
                        </Td>
                      </Tr>
                    ))}
                  </TBody>
                </Table>
              </section>
            </div>

            <Button
              variant={ButtonVariant.Primary}
              disabled={importing || gpusToImport.length === 0}
              className="self-end"
              onClick={handleImportClicked}
            >
              {importing && <Spinner />}
              {!importing && <span>Import {gpusToImport.length} New GPUs</span>}
            </Button>
          </div>
        )}
      </article>
    </AdminLayout>
  );
};
