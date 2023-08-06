import 'reflect-metadata';
import {
  CheckIcon,
  MagnifyingGlassIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import {
  AdminEditProductViewModel,
  AutomationActionType,
  Cpu,
  CpuUpdate,
  getAdminListCpusPath,
  getAdminListGpusPath,
  getViewProductPath,
  Gpu,
  GpuUpdate,
  ProductType,
  UpdateCpuActionData,
  UpdateGpuActionData,
} from '@pcpartdb/shared';
import { automationService } from 'packages/website/src/client/automation';
import { formatProductName } from 'packages/website/src/client/product';
import { productUpdateService } from 'packages/website/src/client/product/services/productUpdateService';
import { WarningAlert } from 'packages/website/src/client/shared/components/Alert/WarningAlert';
import { GenericButton } from 'packages/website/src/client/shared/components/Button/GenericButton';
import React, { useCallback, useMemo, useState } from 'react';
import { MetaRobots, Seo, showDialog } from '../../../../shared/components';
import { AdminLayout } from '../../../../shared/layouts';
import { GpuDiffDialog, GpuForm } from '../../../components';
import { CpuDiffDialog, CpuForm } from '../../../components/cpu';

export const AdminEditProductPage = (props: AdminEditProductViewModel) => {
  const { productType, product } = props;

  // States

  const [pendingUpdate, setPendingUpdate] = useState(props.pendingUpdate);
  const [isTriggeringUpdate, setIsTriggeringUpdate] = useState(false);

  // Memos

  const { viewHref, adminListHref, typeName } = useMemo(() => {
    const viewHref = getViewProductPath(productType, product);
    if (productType === ProductType.Cpu) {
      return {
        viewHref,
        adminListHref: getAdminListCpusPath(),
        typeName: 'CPU',
      };
    } else if (productType === ProductType.Gpu) {
      return {
        viewHref,
        adminListHref: getAdminListGpusPath(),
        typeName: 'GPU',
      };
    } else {
      throw new Error('Invalid product type');
    }
  }, [product, productType]);

  const pageTitle = `Edit ${typeName}`;
  const seoTitle = `${pageTitle} - Admin Panel`;
  const seoRobots = [MetaRobots.NOINDEX, MetaRobots.NOFOLLOW];

  // Callbacks

  const enqueueProductUpdate = useCallback(async () => {
    if (productType === ProductType.Cpu) {
      await automationService.createAction<UpdateCpuActionData>({
        type: AutomationActionType.UpdateCpu,
        description: formatProductName(productType, product),
        data: { cpuId: product.id },
      });
    } else if (productType === ProductType.Gpu) {
      await automationService.createAction<UpdateGpuActionData>({
        type: AutomationActionType.UpdateGpu,
        description: formatProductName(productType, product),
        data: { gpuId: product.id },
      });
    }
  }, [productType, product]);

  const rejectUpdate = useCallback(async () => {
    if (pendingUpdate == null) {
      return;
    }

    setIsTriggeringUpdate(true);
    await productUpdateService.reject(pendingUpdate.id, {});
    setPendingUpdate(null);
    setIsTriggeringUpdate(false);
  }, [pendingUpdate]);

  const approveUpdate = useCallback(async () => {
    if (pendingUpdate == null) {
      return;
    }

    setIsTriggeringUpdate(true);
    await productUpdateService.approve(pendingUpdate.id, {});
    setPendingUpdate(null);
    setIsTriggeringUpdate(false);
  }, [pendingUpdate]);

  const viewUpdate = useCallback(async () => {
    if (pendingUpdate == null) {
      return;
    }

    if (productType === ProductType.Cpu) {
      showDialog(<CpuDiffDialog diff={(pendingUpdate as CpuUpdate).data} />);
    } else if (productType === ProductType.Gpu) {
      showDialog(<GpuDiffDialog diff={(pendingUpdate as GpuUpdate).data} />);
    }
  }, [pendingUpdate, productType]);

  return (
    <AdminLayout>
      <Seo title={seoTitle} robots={seoRobots} />

      <article>
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-semibold mb-0">{pageTitle}</h1>

          <GenericButton href={viewHref}>View {typeName}</GenericButton>
          <GenericButton
            onClick={enqueueProductUpdate}
            disableAfterClickSeconds={5}
            showDisabledTimer
          >
            Enqueue Refresh
          </GenericButton>

          <GenericButton href={adminListHref}>Back</GenericButton>
        </div>

        {pendingUpdate != null && (
          <WarningAlert className="flex items-center">
            <div className="flex-1">
              The {product.name} has a pending update. Saving will auto-reject
              that update.
            </div>
            <div className="flex gap-4">
              <GenericButton
                onClick={approveUpdate}
                disabled={isTriggeringUpdate}
              >
                <CheckIcon className="w-4" />
              </GenericButton>
              <GenericButton
                onClick={rejectUpdate}
                disabled={isTriggeringUpdate}
              >
                <TrashIcon className="w-4" />
              </GenericButton>
              <GenericButton onClick={viewUpdate}>
                <MagnifyingGlassIcon className="w-4" />
              </GenericButton>
            </div>
          </WarningAlert>
        )}

        {productType === ProductType.Cpu && <CpuForm cpu={product as Cpu} />}
        {productType === ProductType.Gpu && <GpuForm gpu={product as Gpu} />}
      </article>
    </AdminLayout>
  );
};
