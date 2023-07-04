import 'reflect-metadata';
import {
  getAdminListCpusPath,
  getAdminListGpusPath,
  ProductType,
} from '@pcpartdb/shared';
import React, { useMemo } from 'react';
import {
  Button,
  ButtonVariant,
  MetaRobots,
  Seo,
} from '../../../shared/components';
import { AdminLayout } from '../../../shared/layouts';
import { GpuForm } from '../../components';
import { CpuForm } from '../../components/cpu';

interface AdminNewProductPageProps {
  productType: ProductType;
}

export const AdminNewProductPage = (props: AdminNewProductPageProps) => {
  const { productType } = props;

  const { adminListHref, typeName } = useMemo(() => {
    if (productType === ProductType.Cpu) {
      return {
        adminListHref: getAdminListCpusPath(),
        typeName: 'CPU',
      };
    } else if (productType === ProductType.Gpu) {
      return {
        adminListHref: getAdminListGpusPath(),
        typeName: 'GPU',
      };
    } else {
      throw new Error('Invalid product type');
    }
  }, [productType]);

  const pageTitle = `Edit ${typeName}`;
  const seoTitle = `${pageTitle} - Admin Panel`;
  const seoRobots = [MetaRobots.NOINDEX, MetaRobots.NOFOLLOW];

  return (
    <AdminLayout>
      <Seo title={seoTitle} robots={seoRobots} />

      <article>
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold">{pageTitle}</h1>

          <Button href={adminListHref} variant={ButtonVariant.Generic}>
            Back
          </Button>
        </div>

        {productType === ProductType.Cpu && <CpuForm />}
        {productType === ProductType.Gpu && <GpuForm />}
      </article>
    </AdminLayout>
  );
};
