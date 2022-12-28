import { productService } from '@client/product/product-service';
import { useProductCache } from '@client/shared/cache';
import { Breadcrumb, Breadcrumbs } from '@client/shared/components';
import { WebsiteLayout } from '@client/shared/layouts';
import { classNames } from '@client/shared/ui';
import {
  Product,
  ProductsQuery,
  ProductType,
  RelatedProducts,
} from '@shared/product';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import {
  CompareProductsForm,
  CompareProductsFormLinks,
} from '../compare-products-form';
import { ListFilters, ListTable, ListTitle } from './components';
import { createListPageContextState, ListPageContext } from './context';
import { generateListUrl } from './utils';

export interface ListGpusPageProps {
  query?: ProductsQuery;
  gpus: Product[];
  totalGpus: number;
  relatedProducts: RelatedProducts;
}

export const ListGpusPage = (props: ListGpusPageProps) => {
  const { totalGpus, relatedProducts } = props;
  useProductCache(props.gpus);
  const router = useRouter();

  const [gpus, setGpus] = useState(props.gpus);
  const [query, setQueryState] = useState(props.query);
  const [canonical, setCanonical] = useState(() => generateListUrl(query));

  const setQuery = useCallback(
    (q: ProductsQuery) => {
      async function fetchGpus() {
        const gpus = await productService.list({
          type: ProductType.GPU,
          query: q,
          includeRanks: true,
        });
        setGpus(gpus);
        setQueryState(q);
      }
      fetchGpus();

      const url = generateListUrl(q);
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

        <section className="flex flex-col gap-8 justify-center">
          <section className={classNames('flex flex-col justify-center gap-4')}>
            <CompareProductsForm values={[null, null]} />
            <CompareProductsFormLinks relatedProducts={relatedProducts} />
          </section>

          <article className="flex-1 flex flex-col gap-4">
            <ListTitle />

            <section className="flex gap-4 items-start">
              <ListTable />
              <ListFilters />
            </section>

            <section>
              <p className="text-xs">
                The ranks on this page considers the {totalGpus} GPUs that we
                track in our database.
              </p>
            </section>
          </article>
        </section>
      </ListPageContext.Provider>
    </WebsiteLayout>
  );
};
