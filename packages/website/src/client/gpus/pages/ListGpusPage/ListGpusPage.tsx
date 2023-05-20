import {
  generateGpusQueryFromPath,
  getHomePath,
  getListGpusPath,
  ListGpusQuery,
  ListGpusViewModel,
} from '@pcpartdb/shared';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useGpuCache } from '../../../shared/cache';
import { Breadcrumb, Breadcrumbs, Seo } from '../../../shared/components';
import { WebsiteLayout } from '../../../shared/layouts';
import { classNames } from '../../../shared/ui';
import { CompareGpusForm } from '../../components';
import { gpuService } from '../../gpuService';
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

export const ListGpusPage = (props: ListGpusViewModel) => {
  useGpuCache(props.gpus);
  const router = useRouter();

  const [gpus, setGpus] = useState(props.gpus);
  const [totalGpus, setTotalGpus] = useState(props.totalGpus);
  const [query, setQuery] = useState(props.query);
  const [contentData, setContentData] = useState(props.contentData);

  const fetchGpus = useCallback(async (q: ListGpusQuery) => {
    const response = await gpuService.list({ query: q });
    setGpus(response.gpus);
    setTotalGpus(response.totalGpus);
    setContentData(response.contentData);
    setQuery(q);
  }, []);

  useEffect(() => {
    router.beforePopState((cb) => {
      fetchGpus(generateGpusQueryFromPath(cb.as));
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
    totalGpus,
    contentData,
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
            <CompareGpusForm values={[null, null]} />
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
