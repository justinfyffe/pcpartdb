import 'reflect-metadata';
import {
  CheckIcon,
  MagnifyingGlassIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import {
  AdminEditProductViewModel,
  AutomationActionType,
  formatProductName,
  formatProductType,
  getAdminListProductsPath,
  getViewProductPath,
  isCpuProduct,
  isGpuProduct,
  ProductType,
  UpdateCpuActionData,
  UpdateGpuActionData,
} from '@pcpartdb/shared';
import { automationService } from 'packages/website/src/client/automation/services/automationService';
import { productUpdateService } from 'packages/website/src/client/product/services/productUpdateService';
import { WarningAlert } from 'packages/website/src/client/shared/components/Alert/WarningAlert';
import { GenericButton } from 'packages/website/src/client/shared/components/Button/GenericButton';
import { showDialog } from 'packages/website/src/client/shared/components/Dialog/dialog';
import {
  MetaRobots,
  Seo,
} from 'packages/website/src/client/shared/components/Seo/Seo';
import { AdminLayout } from 'packages/website/src/client/shared/layouts/admin/AdminLayout';
import React, { useCallback, useMemo, useState } from 'react';
import { ProductDiffDialog } from '../../../components/product/ProductDiffDialog/ProductDiffDialog';
import { ProductForm } from '../../../components/product/ProductForm/ProductForm';

export const AdminEditProductPage = (props: AdminEditProductViewModel) => {
  const { product } = props;
  const productType = product?.productType ?? props.productType;

  // States

  const [pendingUpdate, setPendingUpdate] = useState(props.pendingUpdate);
  const [isTriggeringUpdate, setIsTriggeringUpdate] = useState(false);

  // Memos

  const { viewHref, adminListHref, typeName } = useMemo(() => {
    const viewHref =
      isCpuProduct(product) || isGpuProduct(product)
        ? getViewProductPath(product)
        : null;
    const adminListHref = getAdminListProductsPath({ filter: { productType } });
    const typeName = formatProductType(productType);
    return { viewHref, adminListHref, typeName };
  }, [product, productType]);

  const pageTitle = `Edit ${typeName}`;
  const seoTitle = `${pageTitle} - Admin Panel`;
  const seoRobots = [MetaRobots.NOINDEX, MetaRobots.NOFOLLOW];

  // Callbacks

  const enqueueProductUpdate = useCallback(async () => {
    if (productType === ProductType.Cpu) {
      await automationService.createAction<UpdateCpuActionData>({
        type: AutomationActionType.UpdateCpu,
        description: formatProductName(product),
        data: { cpuId: product.id },
      });
    } else if (productType === ProductType.Gpu) {
      await automationService.createAction<UpdateGpuActionData>({
        type: AutomationActionType.UpdateGpu,
        description: formatProductName(product),
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

    showDialog(
      <ProductDiffDialog productType={productType} diff={pendingUpdate.data} />,
    );
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

        <ProductForm productType={productType} product={product} />
      </article>
    </AdminLayout>
  );
};
