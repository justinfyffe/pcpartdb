import 'reflect-metadata';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  PencilIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {
  getAdminEditGpuPath,
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
import { AutomationStatusContext } from 'packages/website/src/client/shared/layouts/admin/AutomationStatusContext';
import React, { useCallback, useContext, useMemo, useState } from 'react';

interface GpuRetailModelCardTabProps {
  update: GpuUpdate;
}

export const GpuRetailModelCard = (props: GpuRetailModelCardTabProps) => {
  const { update } = props;
  const isUpdate = update.gpuId ? true : false;
  const updatedGpu = update.data.updated;

  const automationStatusContext = useContext(AutomationStatusContext);

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
    await automationStatusContext.refreshStatus();
  }, [automationStatusContext, update.id]);

  const approve = useCallback(async () => {
    await productUpdateService.approve(update.id, {
      slug: slug,
    });
    setStatus(ProductUpdateStatus.Approved);
    await automationStatusContext.refreshStatus();
  }, [automationStatusContext, slug, update.id]);

  const approveAndEdit = useCallback(async () => {
    await approve();
    window.open(getAdminEditGpuPath(slug), '_blank');
  }, [approve, slug]);

  return (
    <Card>
      <div
        className="relative flex justify-between items-center gap-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded && <ChevronDownIcon className="w-4" />}
        {!expanded && <ChevronRightIcon className="w-4" />}

        <div className="flex flex-1 flex-col gap-1">
          <CardTitle>{name}</CardTitle>
          <div className="text-xs">
            <span className="font-semibold">
              {isUpdate ? <>Update</> : <>New</>}:
            </span>{' '}
            {update.id}
          </div>
          <div className="text-xs">
            <span className="font-semibold">Slug:</span> {slug}
          </div>
        </div>

        <div className="flex gap-4 flex-wrap">
          <GenericButton
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              viewDiff();
            }}
          >
            <InformationCircleIcon className="w-4" />
          </GenericButton>

          {status === ProductUpdateStatus.Approved && (
            <CheckIcon className="w-8" />
          )}
          {status === ProductUpdateStatus.Rejected && (
            <XMarkIcon className="w-8" />
          )}
          {status === ProductUpdateStatus.Pending && (
            <>
              <div className="flex flex-wrap gap-4 ml-auto">
                <GenericButton
                  title="Approve"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    approve();
                  }}
                  className="ml-auto"
                >
                  <CheckIcon className="w-4" />
                </GenericButton>

                <GenericButton
                  title="Approve and Edit"
                  className="flex items-center gap-2 ml-auto"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    approveAndEdit();
                  }}
                >
                  <CheckIcon className="w-4" /> + <PencilIcon className="w-4" />
                </GenericButton>
              </div>

              <GenericButton
                title="Reject"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  reject();
                }}
                className="ml-auto"
              >
                <XMarkIcon className="w-4" />
              </GenericButton>
            </>
          )}
        </div>
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
            <div className="flex gap-4 ml-auto">
              <GenericButton
                onClick={approve}
                disabled={status !== ProductUpdateStatus.Pending}
              >
                Approve
              </GenericButton>

              <GenericButton
                onClick={approveAndEdit}
                disabled={status !== ProductUpdateStatus.Pending}
              >
                Approve &amp; Edit
              </GenericButton>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
