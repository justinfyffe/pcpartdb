import {
  generateListGpusQueryFromPath,
  getHomePath,
  getListGpusPath,
  GpuProduct,
  ListGpusQuery,
  ListGpusViewModel,
  ProductType,
} from '@pcpartdb/shared';
import { useRouter } from 'next/router';
import { useProductCache } from 'packages/website/src/client/shared/cache/ProductCache';
import { Breadcrumb } from 'packages/website/src/client/shared/components/Breadcrumbs/Breadcrumb';
import { Breadcrumbs } from 'packages/website/src/client/shared/components/Breadcrumbs/Breadcrumbs';
import { Seo } from 'packages/website/src/client/shared/components/Seo/Seo';
import { WebsiteLayout } from 'packages/website/src/client/shared/layouts/website/WebsiteLayout';
import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CompareProductsForm } from '../../../components/CompareProductsForm/CompareProductsForm';
import { productService } from '../../../services/productService';
import {
  ListFilters,
  ListMenu,
  ListPagination,
  ListPresets,
  ListTable,
  ListTitle,
} from './components';
import { ListPageContext } from './context/ListPageContext';
import { useListPageContextProps } from './hooks/useListPageContextProps';
import { useSeoDescription } from './hooks/useSeoDescription';
import { useSeoTitle } from './hooks/useSeoTitle';

export const ListGpusPage = (props: ListGpusViewModel) => {
  useProductCache(ProductType.Gpu, props.results);
  const router = useRouter();

  const [gpus, setGpus] = useState(props.results);
  const [total, setTotal] = useState(props.total);
  const [query, setQuery] = useState(props.query);
  const [additionalData, setAdditionalData] = useState(props.additionalData);

  const fetchGpus = useCallback(async (query: ListGpusQuery) => {
    const response = await productService.list(ProductType.Gpu, query);
    setGpus(response.results as GpuProduct[]);
    setTotal(response.total);
    setAdditionalData(response.additionalData);
    setQuery(query);
  }, []);

  useEffect(() => {
    router.beforePopState((cb) => {
      fetchGpus(generateListGpusQueryFromPath(cb.as));
      return true;
    });
  }, [fetchGpus, router]);

  const updateQuery = useCallback(
    async (q: ListGpusQuery) => {
      await fetchGpus(q);
      const url = getListGpusPath(q);
      router.push(url, undefined, { shallow: true });
    },
    [fetchGpus, router],
  );

  const context = useListPageContextProps({
    query,
    updateQuery,
    gpus,
    totalGpus: total,
    additionalData: additionalData,
  });

  const seoTitle = useSeoTitle(context);
  const seoDescription = useSeoDescription(context);
  const seoKeywords: string[] = [];
  const seoCanonical = useMemo(() => getListGpusPath(query), [query]);

  const homeHref = useMemo(() => getHomePath(), []);

  return (
    <WebsiteLayout>
      <Seo
        title={seoTitle}
        keywords={seoKeywords}
        description={seoDescription}
        canonical={seoCanonical}
      />

      <ListPageContext.Provider value={context}>
        <Breadcrumbs className="mb-4">
          <Breadcrumb href={homeHref}>Home</Breadcrumb>
          <Breadcrumb>Graphics Cards</Breadcrumb>
        </Breadcrumbs>

        <section className="flex flex-col gap-8 justify-center mb-4">
          <section className={classNames('flex flex-col justify-center gap-4')}>
            <CompareProductsForm
              productType={ProductType.Gpu}
              values={[null, null]}
            />
          </section>

          <article className="flex-1 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <ListTitle />
              <ListMenu
                includeFilters
                includePresets
                className="hidden lg:block"
              />
            </div>

            <section className="flex gap-4 items-start">
              <div className="flex-1 flex flex-col gap-4 max-w-full">
                <ListTable />
                <ListPagination />
              </div>

              <aside className="lg:hidden flex flex-col gap-4">
                <div className="border-px">
                  <ListFilters />
                </div>
                <div className="border-px">
                  <ListPresets />
                </div>
              </aside>
            </section>
          </article>
        </section>
      </ListPageContext.Provider>
    </WebsiteLayout>
  );
};
