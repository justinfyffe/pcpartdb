import {
  generateGpusQueryFromPath,
  getHomePath,
  getListGpusPath,
  GpusQuery,
  ListGpusViewModel,
} from '@pcpartdb/shared';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { CompareGpusForm } from '../../../gpus/components';
import { gpuService } from '../../../gpus/gpu-service';
import { useGpuCache } from '../../../shared/cache';
import {
  Breadcrumb,
  Breadcrumbs,
  Pagination,
  PaginationResult,
  Seo,
} from '../../../shared/components';
import { WebsiteLayout } from '../../../shared/layouts';
import { classNames } from '../../../shared/ui';
import {
  ListFilters,
  ListPresetsMenu,
  ListTable,
  ListTitle,
} from './components';
import { createListPageContextState, ListPageContext } from './context';

export const ListGpusPage = (props: ListGpusViewModel) => {
  useGpuCache(props.gpus);
  const router = useRouter();

  const [gpus, setGpus] = useState(props.gpus);
  const [totalResults, setTotalResults] = useState(props.totalResults);
  const [query, setQuery] = useState(props.query);
  const [canonical, setCanonical] = useState(() => getListGpusPath(query));

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
      setCanonical(url);
    },
    [fetchGpus, router],
  );

  const paginationPageClick = useCallback(
    (result: PaginationResult, evt: React.MouseEvent) => {
      evt.preventDefault();
      evt.stopPropagation();
      updateQuery({ ...query, offset: result.offset, limit: result.limit });
    },
    [query, updateQuery],
  );

  const paginationHrefBuilder = useCallback(
    (result: PaginationResult) =>
      getListGpusPath({ ...query, offset: result.offset, limit: result.limit }),
    [query],
  );

  const context = createListPageContextState({ query, updateQuery, gpus });
  const title = 'Graphics Cards';
  const keywords: string[] = [];

  return (
    <WebsiteLayout>
      <Seo title={title} keywords={keywords} canonical={canonical} />

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
                <Pagination
                  resultsOffset={query.offset}
                  resultsPerPage={query.limit}
                  totalResults={totalResults}
                  onPageClick={paginationPageClick}
                  hrefBuilder={paginationHrefBuilder}
                  neighborPagesClassName="lg:hidden"
                  hidePages={false}
                />
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
