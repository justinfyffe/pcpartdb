import 'reflect-metadata';
import {
  AdminEditProductViewModel,
  Cpu,
  getAdminListCpusPath,
  getAdminListGpusPath,
  getViewProductPath,
  Gpu,
  ProductType,
} from '@pcpartdb/shared';
import React, { useMemo } from 'react';
import {
  Button,
  ButtonVariant,
  MetaRobots,
  Seo,
} from '../../../../shared/components';
import { AdminLayout } from '../../../../shared/layouts';
import { GpuForm } from '../../../components';
import { CpuForm } from '../../../components/cpu';

export const AdminEditProductPage = (props: AdminEditProductViewModel) => {
  const { productType, product } = props;

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

  return (
    <AdminLayout>
      <Seo title={seoTitle} robots={seoRobots} />

      <article>
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold">{pageTitle}</h1>

          <Button href={viewHref} variant={ButtonVariant.Generic}>
            View {typeName}
          </Button>

          <Button href={adminListHref} variant={ButtonVariant.Generic}>
            Back
          </Button>
        </div>

        {productType === ProductType.Cpu && <CpuForm cpu={product as Cpu} />}
        {productType === ProductType.Gpu && <GpuForm gpu={product as Gpu} />}
      </article>
    </AdminLayout>
  );
};
