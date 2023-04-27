import 'reflect-metadata';
import { ApiError, getAdminListGpusPath, Gpu, GpuDiff } from '@pcpartdb/shared';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo, useState } from 'react';
import { gpuService } from '../../../gpus';
import {
  Alert,
  AlertVariant,
  Button,
  ButtonVariant,
  Field,
  FieldHint,
  File,
  MetaRobots,
  Seo,
  Spinner,
} from '../../../shared/components';
import { AdminLayout } from '../../../shared/layouts';
import { ImportGpusTable } from './components';
import { ImportGpusPageContext } from './context';
import { useImportGpusPageContextProps } from './hooks';

interface AdminImportGpusPageProps {}

export const AdminImportGpusPage = (_props: AdminImportGpusPageProps) => {
  const [newDiffs, setNewDiffs] = useState<GpuDiff[]>([]);
  const [existingDiffs, setExistingDiffs] = useState<GpuDiff[]>([]);
  const [gpusToImport, setGpusToImport] = useState({} as Record<string, Gpu>);

  const router = useRouter();
  const [importing, setImporting] = useState(false);
  const [requestError, setRequestError] = useState<ApiError>(null);

  const hasData = newDiffs.length > 0 || existingDiffs.length > 0;
  const gpusToImportList = useMemo(
    () => Object.values(gpusToImport).filter((value) => value != null),
    [gpusToImport],
  );

  const handleFileChange = useCallback(async (file: File) => {
    const results = await gpuService.previewImportGpus(file);

    const newDiffs = results.diffs.filter((value) => value.original == null);
    const existingDiffs = results.diffs.filter(
      (value) => value.original != null,
    );

    setNewDiffs(newDiffs);
    setExistingDiffs(existingDiffs);

    setGpusToImport(
      [...newDiffs].reduce((acc, diff) => {
        acc[diff.updated.slug] = diff.updated;
        return acc;
      }, {} as Record<string, Gpu>),
    );
  }, []);

  const handleImportSelection = useCallback(
    (diff: GpuDiff, checked: boolean) => {
      const gpu = diff.updated;
      if (checked) {
        gpusToImport[gpu.slug] = gpu;
        setGpusToImport({ ...gpusToImport });
      } else {
        delete gpusToImport[gpu.slug];
        setGpusToImport({ ...gpusToImport });
      }
    },
    [gpusToImport],
  );

  const handleImportClicked = useCallback(async () => {
    setImporting(true);

    try {
      await gpuService.importGpus({ gpus: gpusToImportList });

      router.push('/admin/gpus');
    } catch (err) {
      console.error(err);
      setRequestError(err as ApiError);
    } finally {
      setImporting(false);
    }
  }, [gpusToImportList, router]);

  const pageTitle = 'Import GPUs';
  const seoTitle = `${pageTitle} - Admin Panel`;
  const seoRobots = [MetaRobots.NOINDEX, MetaRobots.NOFOLLOW];

  const context = useImportGpusPageContextProps({
    gpusToImport,
    onImportSelection: handleImportSelection,
  });

  return (
    <ImportGpusPageContext.Provider value={context}>
      <AdminLayout>
        <Seo title={seoTitle} robots={seoRobots} />

        <article>
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-semibold">{pageTitle}</h1>

            <Button
              href={getAdminListGpusPath()}
              variant={ButtonVariant.Default}
            >
              Back
            </Button>
          </div>

          {requestError && (
            <Alert variant={AlertVariant.Error}>
              An unknown error has occurred. Please try again later.
            </Alert>
          )}

          <Field className="flex-1 mx-2">
            File
            <File name="file" onChange={handleFileChange} />
            <FieldHint className="flex justify-between">
              Upload results from scraping tool
            </FieldHint>
          </Field>

          {hasData && (
            <div className="flex flex-col mt-4 gap-4">
              <h2 className="mb-0">Preview</h2>

              <div className="flex gap-4">
                <section className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="mb-0">New GPUs</h3>
                    <span>{newDiffs.length} GPUs</span>
                  </div>

                  <ImportGpusTable diffs={newDiffs} />
                </section>

                <section className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="mb-0">Existing GPUs</h3>
                    <span>{existingDiffs.length} GPUs</span>
                  </div>

                  <ImportGpusTable diffs={existingDiffs} />
                </section>
              </div>

              <Button
                variant={ButtonVariant.Primary}
                disabled={importing || gpusToImportList.length === 0}
                className="self-end"
                onClick={handleImportClicked}
              >
                {importing && <Spinner />}
                {!importing && (
                  <span>Import {gpusToImportList.length} GPUs</span>
                )}
              </Button>
            </div>
          )}
        </article>
      </AdminLayout>
    </ImportGpusPageContext.Provider>
  );
};
