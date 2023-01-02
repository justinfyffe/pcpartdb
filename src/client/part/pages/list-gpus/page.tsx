import { ComparePartsForm } from '@client/part/components';
import { partService } from '@client/part/part-service';
import { usePartCache } from '@client/shared/cache';
import { Breadcrumb, Breadcrumbs } from '@client/shared/components';
import { WebsiteLayout } from '@client/shared/layouts';
import { classNames } from '@client/shared/ui';
import { Part, PartsQuery, PartType } from '@shared/part';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import {
  ListFilters,
  ListPresetsMenu,
  ListTable,
  ListTitle,
} from './components';
import { createListPageContextState, ListPageContext } from './context';
import { getListPath } from './utils';

export interface ListGpusPageProps {
  query?: PartsQuery;
  gpus: Part[];
  totalGpus: number;
}

export const ListGpusPage = (props: ListGpusPageProps) => {
  const { totalGpus } = props;
  usePartCache(props.gpus);
  const router = useRouter();

  const [gpus, setGpus] = useState(props.gpus);
  const [query, setQueryState] = useState(props.query);
  const [canonical, setCanonical] = useState(() => getListPath(query));

  const setQuery = useCallback(
    (q: PartsQuery) => {
      async function fetchGpus() {
        const gpus = await partService.list({
          type: PartType.GPU,
          query: q,
          includeRanks: true,
        });
        setGpus(gpus);
        setQueryState(q);
      }
      fetchGpus();

      const url = getListPath(q);
      router.replace(url, undefined, { shallow: true });
      setCanonical(url);
    },
    [router],
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

        <section className="flex flex-col gap-8 justify-center mb-8">
          <section className={classNames('flex flex-col justify-center gap-4')}>
            <ComparePartsForm values={[null, null]} />
          </section>

          <article className="flex-1 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <ListTitle />
              <ListPresetsMenu className="md:hidden" />
              <ListPresetsMenu includeFilters className="hidden md:block" />
            </div>

            <section className="flex gap-4 items-start">
              <ListTable />
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
