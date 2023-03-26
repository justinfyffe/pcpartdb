import {
  generateGpusQueryFromPath,
  getHomePath,
  getListGpusPath,
  GpusQuery,
  ListGpusViewModel,
} from '@pcpartdb/shared';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CompareGpusForm } from '../../../gpus/components';
import { gpuService } from '../../../gpus/gpu-service';
import { useGpuCache } from '../../../shared/cache';
import { Breadcrumb, Breadcrumbs, Seo } from '../../../shared/components';
import { WebsiteLayout } from '../../../shared/layouts';
import { classNames } from '../../../shared/ui';
import {
  ListFilters,
  ListPagination,
  ListPresetsMenu,
  ListTable,
  ListTitle,
} from './components';
import { ListPageContext, useListPageContextProps } from './context';
import { useSeoTitle } from './hooks';

export const ListGpusPage = (props: ListGpusViewModel) => {
  useGpuCache(props.gpus);
  const router = useRouter();

  const [gpus, setGpus] = useState(props.gpus);
  const [totalResults, setTotalResults] = useState(props.totalResults);
  const [query, setQuery] = useState(props.query);

  const fetchGpus = useCallback(async (q: GpusQuery) => {
    const response = await gpuService.list({ query: q });
    setGpus(response.gpus);
    setTotalResults(response.totalGpus);
    setQuery(q);
  }, []);

  useEffect(() => {
    router.beforePopState((cb) => {
      fetchGpus(generateGpusQueryFromPath(cb.as));
      return true;
    });
  }, [fetchGpus, router]);

  const updateQuery = useCallback(
    async (q: GpusQuery) => {
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
    totalResults,
  });

  const seoTitle = useSeoTitle(context);
  const seoKeywords: string[] = [];
  const seoCanonical = useMemo(() => getListGpusPath(query), [query]);

  return (
    <WebsiteLayout>
      <Seo title={seoTitle} keywords={seoKeywords} canonical={seoCanonical} />

      <ListPageContext.Provider value={context}>
        <Breadcrumbs className="mb-4">
          <Breadcrumb href={getHomePath()}>Home</Breadcrumb>
          <Breadcrumb>Graphics Cards</Breadcrumb>
        </Breadcrumbs>

        <section className="flex flex-col gap-8 justify-center mb-4">
          <section className={classNames('flex flex-col justify-center gap-4')}>
            <CompareGpusForm values={[null, null]} />
          </section>

          <article className="flex-1 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <ListTitle />
              <ListPresetsMenu className="md:hidden" />
              <ListPresetsMenu includeFilters className="hidden md:block" />
            </div>

            <section className="flex gap-4 items-start">
              <div className="flex-1 flex flex-col gap-4">
                <ListTable />
                <ListPagination />
              </div>

              <aside className="md:hidden border-px">
                <ListFilters />
              </aside>
            </section>
          </article>
        </section>
      </ListPageContext.Provider>
    </WebsiteLayout>
  );
};
