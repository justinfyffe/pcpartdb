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
  CpuUpdate,
  formatCpuName,
  getAdminEditCpuPath,
  getViewCpuPath,
  ProductUpdateStatus,
} from '@pcpartdb/shared';
import { CpuDiffDialog } from 'packages/website/src/client/admin/components';
import { productUpdateService } from 'packages/website/src/client/product/services/productUpdateService';
import {
  Card,
  CardContent,
  CardTitle,
  showDialog,
  TextInput,
} from 'packages/website/src/client/shared/components';
import { GenericButton } from 'packages/website/src/client/shared/components/Button/GenericButton';
import {
  Field,
  FieldHint,
} from 'packages/website/src/client/shared/components/Field/Field';
import { AutomationStatusContext } from 'packages/website/src/client/shared/layouts/admin/AutomationStatusContext';
import React, { useCallback, useContext, useMemo, useState } from 'react';

interface CpuCardTabProps {
  update: CpuUpdate;
}

export const CpuCard = (props: CpuCardTabProps) => {
  const { update } = props;
  const isUpdate = update.cpuId ? true : false;
  const updatedCpu = update.data.updated;

  const automationStatusContext = useContext(AutomationStatusContext);

  // States

  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState(update.status);

  const [slug, setSlug] = useState(updatedCpu.slug);

  // Memos

  const name = useMemo(() => formatCpuName(updatedCpu), [updatedCpu]);
  const viewHref = useMemo(() => getViewCpuPath(updatedCpu), [updatedCpu]);

  // Callbacks

  const viewDiff = useCallback(() => {
    showDialog(<CpuDiffDialog diff={update.data} />);
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
    window.open(getAdminEditCpuPath(slug), '_blank');
  }, [approve, slug]);

  return (
    <Card>
      <div
        className="relative flex justify-between items-center gap-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded && <ChevronDownIcon className="w-4" />}
        {!expanded && <ChevronRightIcon className="w-4" />}

        <div className="flex flex-1 flex-col gap-1 min-w-30">
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
            className="ml-auto"
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
                  This will be used as the CPU&apos;s URL when it is created.
                </FieldHint>
              )}
            </Field>

            <GenericButton onClick={viewDiff}>Diff</GenericButton>
          </div>

          <div className="flex flex-wrap justify-between gap-4">
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
