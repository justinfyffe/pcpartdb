import 'reflect-metadata';
import { ChevronDownIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import {
  getViewGpuPath,
  GpuUpdate,
  ProductUpdateStatus,
} from '@pcpartdb/shared';
import { GpuDiffDialog } from 'packages/website/src/client/admin/components';
import { formatGpuName } from 'packages/website/src/client/product';
import { productUpdateService } from 'packages/website/src/client/product/services/productUpdateService';
import {
  Card,
  CardContent,
  CardTitle,
  Field,
  FieldHint,
  showDialog,
  TextInput,
} from 'packages/website/src/client/shared/components';
import { GenericButton } from 'packages/website/src/client/shared/components/Button/GenericButton';
import React, { useCallback, useMemo, useState } from 'react';

interface GpuCardTabProps {
  update: GpuUpdate;
}

export const GpuCard = (props: GpuCardTabProps) => {
  const { update } = props;
  const isUpdate = update.gpuId ? true : false;
  const updatedGpu = update.data.updated;

  // States

  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState(update.status);

  const [slug, setSlug] = useState(updatedGpu.slug);

  // Memos

  const name = useMemo(() => formatGpuName(updatedGpu), [updatedGpu]);
  const viewHref = useMemo(() => getViewGpuPath(updatedGpu), [updatedGpu]);

  // Callbacks

  const viewDiff = useCallback(() => {
    showDialog(<GpuDiffDialog diff={update.data} />);
  }, [update.data]);

  const reject = useCallback(async () => {
    await productUpdateService.reject(update.id, {});
    setStatus(ProductUpdateStatus.Rejected);
  }, [update.id]);

  const approve = useCallback(async () => {
    await productUpdateService.approve(update.id, {
      slug: slug,
    });
    setStatus(ProductUpdateStatus.Approved);
  }, [slug, update.id]);

  return (
    <Card>
      <div
        className="relative flex justify-between items-center gap-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="absolute left-0 right-0 flex justify-center text-3xl text-dimmed">
          {status === ProductUpdateStatus.Approved && <>Approved</>}
          {status === ProductUpdateStatus.Rejected && <>Rejected</>}
          {status === ProductUpdateStatus.Pending && <>Pending</>}
        </div>

        <div className="flex flex-col gap-1">
          <CardTitle>{name}</CardTitle>
          <span className="text-sm text-dimmed">
            {isUpdate ? <>Update</> : <>New</>}: {update.id}
          </span>
        </div>

        {expanded && <ChevronDownIcon className="w-8" />}
        {!expanded && <ChevronLeftIcon className="w-8" />}
      </div>

      {expanded && (
        <CardContent>
          <div className="flex gap-4 items-center">
            <Field className="flex-1">
              <div className="flex justify-between">Slug</div>
              <TextInput value={slug} onChange={setSlug} disabled={isUpdate} />
              {!isUpdate && (
                <FieldHint>
                  This will be used as the GPU&apos;s URL when it is created.
                </FieldHint>
              )}
            </Field>

            <GenericButton onClick={viewDiff}>Diff</GenericButton>
          </div>

          <div className="flex justify-between gap-4">
            <GenericButton
              onClick={reject}
              disabled={status !== ProductUpdateStatus.Pending}
            >
              Reject
            </GenericButton>
            {isUpdate && (
              <GenericButton href={viewHref} target="_blank">
                View Page
              </GenericButton>
            )}
            <GenericButton
              onClick={approve}
              disabled={status !== ProductUpdateStatus.Pending}
            >
              Approve
            </GenericButton>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
