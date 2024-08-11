import {
  ApiError,
  generateListCpusQueryFromSearchParams,
  getHomePath,
  getListCpusPath,
  getListCpusUrl,
  isApiError,
  isNotFoundError,
  joinUrlParts,
  ListCpusRequest,
  ListCpusViewModel,
  ProductType,
} from '@pcpartdb/shared';
import { Metadata, ResolvingMetadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { viewModelClient } from 'packages/website/src/app/_common/api/ViewModelClient';
import { CacheProvider } from 'packages/website/src/app/_common/cache/CacheProvider';
import { DisplayAd } from 'packages/website/src/app/_common/components/Ad/DisplayAd';
import { MultiplexAd } from 'packages/website/src/app/_common/components/Ad/MultiplexAd';
import { AdUnit } from 'packages/website/src/app/_common/components/Ad/types';
import { CompareProductsForm } from 'packages/website/src/app/_common/product/components/CompareProductsForm/CompareProductsForm';
import { classNames } from 'packages/website/src/app/_common/utils/classNames';
import React from 'react';
import { DocumentTitle } from './_components/DocumentTitle/DocumentTitle';
import { ListDescription } from './_components/ListDescription/ListDescription';
import { ListFilters } from './_components/ListFilters/ListFilters';
import { ListFiltersDialogTrigger } from './_components/ListFilters/ListFiltersDialogTrigger';
import { ListPagination } from './_components/ListPagination/ListPagination';
import { ListPresets } from './_components/ListPresets/ListPresets';
import { ListTable } from './_components/ListTable/ListTable';
import { ListTitle } from './_components/ListTitle/ListTitle';
import { buildDocumentTitle } from './_content/buildDocumentTitle';
import { buildPageDescription } from './_content/buildPageDescription';
import { ListProvider } from './ListProvider';

type ListCpusPageProps = {
  params: Record<string, string | string[]>;
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  props: ListCpusPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const query = generateListCpusQueryFromSearchParams({
    query: { ...props.params, ...props.searchParams },
  });
  const benchmark = props.searchParams.cpu_benchmark as string;

  const endpoint = joinUrlParts(
    'cpus/list',
    `?${new URLSearchParams({
      req: JSON.stringify({
        query,
      } as ListCpusRequest),
    })}`,
  );

  const viewModel = await viewModelClient.get<ListCpusViewModel | ApiError>(
    endpoint,
    {
      preferredBenchmarks: { cpu: benchmark },
      headers: { Cookie: cookies().toString() },
    },
  );
  if (isApiError(viewModel)) {
    return {};
  }

  const title = buildDocumentTitle(query);
  const description = buildPageDescription(query);
  const canonical = getListCpusUrl(query);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      locale: 'en_US',
      url: canonical,
    },
  };
}

export default async function ListCpusPage(props: ListCpusPageProps) {
  const query = generateListCpusQueryFromSearchParams({
    query: { ...props.params, ...props.searchParams },
  });
  const benchmark = props.searchParams.cpu_benchmark as string;

  const endpoint = joinUrlParts(
    'cpus/list',
    `?${new URLSearchParams({
      req: JSON.stringify({
        query,
      } as ListCpusRequest),
    })}`,
  );

  const response = await viewModelClient.get<ListCpusViewModel | ApiError>(
    endpoint,
    {
      preferredBenchmarks: { cpu: benchmark },
      headers: { Cookie: cookies().toString() },
    },
  );
  if (isNotFoundError(response)) {
    throw notFound();
  } else if (isApiError(response)) {
    throw response;
  }

  return (
    <CacheProvider products={response.results}>
      <ListProvider viewModel={response}>
        <DocumentTitle />

        <section className="flex flex-col gap-8 justify-center mb-4">
          <section className={classNames('flex flex-col justify-center gap-4')}>
            <h2 className="mb-0">Search CPUs</h2>
            <CompareProductsForm
              productType={ProductType.Cpu}
              values={[null, null]}
            />
          </section>

          <DisplayAd unit={AdUnit.ListPagePreTitleDisplay} />

          <article className="flex-1 flex flex-col gap-4">
            <ListDescription />

            <div className="flex items-center justify-between">
              <ListTitle />
              <ListFiltersDialogTrigger className="hidden lg:block" />
            </div>

            <section className="flex gap-4 items-start">
              <div className="flex-1 flex flex-col gap-4 max-w-full">
                <ListTable />
                <ListPagination />

                <MultiplexAd unit={AdUnit.ListPageTableSideMultiplex} />
              </div>

              <aside className="lg:hidden flex flex-col gap-4 max-w-62">
                <div className="border-px">
                  <ListFilters />
                </div>

                <MultiplexAd unit={AdUnit.ListPageTableFooterMultiplex} />

                <div className="border-px">
                  <ListPresets />
                </div>
              </aside>
            </section>
          </article>
        </section>
      </ListProvider>
    </CacheProvider>
  );
}
