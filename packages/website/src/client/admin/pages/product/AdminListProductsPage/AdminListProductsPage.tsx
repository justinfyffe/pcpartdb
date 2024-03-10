import 'reflect-metadata';
import { getAdminNewProductPath } from '@pcpartdb/shared';
import { useRouter } from 'next/router';
import { InfoAlert } from 'packages/website/src/client/shared/components/Alert/InfoAlert';
import { SuccessAlert } from 'packages/website/src/client/shared/components/Alert/SuccessAlert';
import { GenericButton } from 'packages/website/src/client/shared/components/Button/GenericButton';
import {
  MetaRobots,
  Seo,
} from 'packages/website/src/client/shared/components/Seo/Seo';
import { AdminLayout } from 'packages/website/src/client/shared/layouts/admin/AdminLayout';
import React, { useState } from 'react';
import { ListFilters } from './components/ListFilters/ListFilters';
import { ListPagination } from './components/ListPagination/ListPagination';
import { ListTable } from './components/ListTable/ListTable';
import {
  AdminListProductsContext,
  useAdminListProductsContextBuilder,
} from './context/AdminListProductsContext';

export const AdminListProductsPage = () => {
  const router = useRouter();
  const [saved] = useState(router.query.saved === 'true');
  const [deleted] = useState(router.query.deleted === 'true');

  const pageTitle = 'Products';
  const seoTitle = `${pageTitle} - Admin Panel`;
  const seoRobots = [MetaRobots.NOINDEX, MetaRobots.NOFOLLOW];

  const context = useAdminListProductsContextBuilder();

  return (
    <AdminLayout>
      <Seo title={seoTitle} robots={seoRobots} />

      <AdminListProductsContext.Provider value={context}>
        <article>
          <section>
            {saved && <SuccessAlert>The product has been saved.</SuccessAlert>}

            {deleted && (
              <SuccessAlert>The product has been deleted.</SuccessAlert>
            )}
          </section>

          <div className="flex items-center justify-between mb-4">
            <h1 className="font-semibold">{pageTitle}</h1>

            <div className="flex gap-4">
              <GenericButton
                href={getAdminNewProductPath({
                  productType: context.query?.filter?.productType,
                })}
              >
                Add
              </GenericButton>
            </div>
          </div>

          <section>
            <ListFilters />
            {context.totalProducts > 0 ? (
              <>
                <ListTable />
                <ListPagination />
              </>
            ) : (
              <>
                <InfoAlert>There are no products for these filters.</InfoAlert>
              </>
            )}
          </section>
        </article>
      </AdminListProductsContext.Provider>
    </AdminLayout>
  );
};
