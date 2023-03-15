import { GpusQuery, ListGpusViewModel } from '@pcpartdb/shared';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import { CompareGpusForm } from '../../../gpus/components';
import { gpuService } from '../../../gpus/gpu-service';
import { useGpuCache } from '../../../shared/cache';
import {
  Breadcrumb,
  Breadcrumbs,
  Pagination,
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
import { getListPath } from './utils';

export const ListGpusPage = (props: ListGpusViewModel) => {
  const { totalGpus } = props;
  useGpuCache(props.gpus);
  const router = useRouter();

  const [gpus, setGpus] = useState(props.gpus);
  const [totalResults, setTotalResults] = useState(props.totalResults);
  const [query, setQueryState] = useState(props.query);
  const [canonical, setCanonical] = useState(() => getListPath(query));

  const setQuery = useCallback(
    (q: GpusQuery) => {
      async function fetchGpus() {
        const response = await gpuService.list({ query: q });
        setGpus(response.gpus);
        setTotalResults(response.totalGpus);
        setQueryState(q);
      }
      fetchGpus();

      const url = getListPath(q);
      router.replace(url, undefined, { shallow: true });
      setCanonical(url);
    },
    [router],
  );

  const getPageUrl = useCallback(
    (page: number) => {
      return getListPath({ ...query, offset: query.limit * (page - 1) });
    },
    [query],
  );

  const context = createListPageContextState({ query, setQuery, gpus });

  const title = 'Graphics Cards';
  const keywords: string[] = [];

  return (
    <WebsiteLayout seo={{ title, keywords, canonical }}>
      <ListPageContext.Provider value={context}>
        <Breadcrumbs className="mb-4">
          <Breadcrumb href="/">Home</Breadcrumb>
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
                  currentPage={Math.ceil(1 + query.offset / query.limit)}
                  resultsPerPage={query.limit}
                  totalResults={totalResults}
                  hrefBuilder={getPageUrl}
                  hidePages
                />
              </div>

              <aside className="md:hidden border-px">
                <ListFilters />
              </aside>
            </section>
          </article>
        </section>

        <section>
          <p className="text-xs">
            The ranks on this page are based on the {totalGpus} GPUs that we
            track in our database.
          </p>
        </section>
      </ListPageContext.Provider>
    </WebsiteLayout>
  );
};
