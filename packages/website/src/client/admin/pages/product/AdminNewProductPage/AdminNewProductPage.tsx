import 'reflect-metadata';
import {
  formatProductType,
  getAdminListProductsPath,
  ProductType,
} from '@pcpartdb/shared';
import { GenericButton } from 'packages/website/src/client/shared/components/Button/GenericButton';
import {
  MetaRobots,
  Seo,
} from 'packages/website/src/client/shared/components/Seo/Seo';
import { AdminLayout } from 'packages/website/src/client/shared/layouts/admin/AdminLayout';
import React, { useMemo, useState } from 'react';
import { ProductForm } from '../../../components/product/ProductForm/ProductForm';
import { ProductTypeInput } from '../../../components/product/ProductTypeInput/ProductTypeInput';

export interface AdminNewProductPageProps {
  productType?: ProductType;
}

export const AdminNewProductPage = (props: AdminNewProductPageProps) => {
  const [productType, setProductType] = useState(props.productType);

  const { adminListHref, typeName } = useMemo(() => {
    const adminListHref = getAdminListProductsPath({ filter: { productType } });
    const typeName =
      productType != null ? formatProductType(productType) : 'Product';
    return { adminListHref, typeName };
  }, [productType]);

  const pageTitle = `Create ${typeName}`;
  const seoTitle = `${pageTitle} - Admin Panel`;
  const seoRobots = [MetaRobots.NOINDEX, MetaRobots.NOFOLLOW];

  return (
    <AdminLayout>
      <Seo title={seoTitle} robots={seoRobots} />

      <article>
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold">{pageTitle}</h1>

          <GenericButton href={adminListHref}>Back</GenericButton>
        </div>

        <section className="mb-4 pb-4 border-b-px flex flex-col gap-1">
          <label>Type of Product:</label>
          <ProductTypeInput value={productType} onChange={setProductType} />
        </section>

        {productType != null && <ProductForm productType={productType} />}
      </article>
    </AdminLayout>
  );
};
