import {
  generateListCpusQueryFromPath,
  getHomePath,
  getListCpusPath,
  ListCpusQuery,
  ListCpusViewModel,
  ProductType,
} from '@pcpartdb/shared';
import { useRouter } from 'next/router';
import { useProductCache } from 'packages/website/src/client/shared/cache';
import { Breadcrumb } from 'packages/website/src/client/shared/components/Breadcrumbs/Breadcrumb';
import { Breadcrumbs } from 'packages/website/src/client/shared/components/Breadcrumbs/Breadcrumbs';
import { Seo } from 'packages/website/src/client/shared/components/Seo/Seo';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { WebsiteLayout } from '../../../../shared/layouts';
import { classNames } from '../../../../shared/ui';
import { CompareProductsForm } from '../../../components';
import { cpuService } from '../../../services/cpuService';
import {
  ListFilters,
  ListMenu,
  ListPagination,
  ListPresets,
  ListTable,
  ListTitle,
} from './components';
import { ListPageContext } from './context';
import {
  useListPageContextProps,
  useSeoDescription,
  useSeoTitle,
} from './hooks';

export const ListCpusPage = (props: ListCpusViewModel) => {
  useProductCache(ProductType.Cpu, props.cpus);
  const router = useRouter();

  const [cpus, setCpus] = useState(props.cpus);
  const [totalCpus, setTotalCpus] = useState(props.totalCpus);
  const [query, setQuery] = useState(props.query);
  const [contentData, setContentData] = useState(props.contentData);

  const fetchCpus = useCallback(async (query: ListCpusQuery) => {
    const response = await cpuService.list(query);
    setCpus(response.cpus);
    setTotalCpus(response.totalCpus);
    setContentData(response.contentData);
    setQuery(query);
  }, []);

  useEffect(() => {
    router.beforePopState((cb) => {
      fetchCpus(generateListCpusQueryFromPath(cb.as));
      return true;
    });
  }, [fetchCpus, router]);

  const updateQuery = useCallback(
    async (q: ListCpusQuery) => {
      await fetchCpus(q);
      const url = getListCpusPath(q);
      router.push(url, undefined, { shallow: true });
    },
    [fetchCpus, router],
  );

  const context = useListPageContextProps({
    query,
    updateQuery,
    cpus,
    totalCpus,
    contentData,
  });

  const seoTitle = useSeoTitle(context);
  const seoDescription = useSeoDescription(context);
  const seoKeywords: string[] = [];
  const seoCanonical = useMemo(() => getListCpusPath(query), [query]);

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
          <Breadcrumb>Processors</Breadcrumb>
        </Breadcrumbs>

        <section className="flex flex-col gap-8 justify-center mb-4">
          <section className={classNames('flex flex-col justify-center gap-4')}>
            <CompareProductsForm
              productType={ProductType.Cpu}
              values={[null, null]}
            />
          </section>

          <article className="flex-1 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <ListTitle />
              <ListMenu
                includeFilters
                includePresets
                className="hidden md:block"
              />
            </div>

            <section className="flex gap-4 items-start">
              <div className="flex-1 flex flex-col gap-4 max-w-full">
                <ListTable />
                <ListPagination />
              </div>

              <aside className="md:hidden flex flex-col gap-4">
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
