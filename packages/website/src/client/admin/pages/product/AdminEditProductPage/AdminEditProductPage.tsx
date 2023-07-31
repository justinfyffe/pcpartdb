import 'reflect-metadata';
import {
  AdminEditProductViewModel,
  AutomationActionType,
  Cpu,
  getAdminListCpusPath,
  getAdminListGpusPath,
  getViewProductPath,
  Gpu,
  ProductType,
  UpdateCpuActionData,
  UpdateGpuActionData,
} from '@pcpartdb/shared';
import { automationService } from 'packages/website/src/client/automation';
import { formatProductName } from 'packages/website/src/client/product';
import { GenericButton } from 'packages/website/src/client/shared/components/Button/GenericButton';
import React, { useCallback, useMemo } from 'react';
import { MetaRobots, Seo } from '../../../../shared/components';
import { AdminLayout } from '../../../../shared/layouts';
import { GpuForm } from '../../../components';
import { CpuForm } from '../../../components/cpu';

export const AdminEditProductPage = (props: AdminEditProductViewModel) => {
  const { productType, product } = props;

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
        type: AutomationActionType.UpdateCpu,
        description: formatProductName(productType, product),
        data: { gpuId: product.id },
      });
    }
  }, [productType, product]);

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

        {productType === ProductType.Cpu && <CpuForm cpu={product as Cpu} />}
        {productType === ProductType.Gpu && <GpuForm gpu={product as Gpu} />}
      </article>
    </AdminLayout>
  );
};
