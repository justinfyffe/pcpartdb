import {
  ApiError,
  formatProductName,
  getViewGpuPath,
  getViewGpuUrl,
  isApiError,
  isNotFoundError,
  joinUrlParts,
  ProductType,
  ViewGpuViewModel,
  viewGpuViewModelNormalizr,
  WEBSITE_NAME,
} from '@pcpartdb/shared';
import { Metadata, ResolvingMetadata } from 'next';
import { cookies } from 'next/headers';
import { notFound, permanentRedirect, RedirectType } from 'next/navigation';
import { viewModelClient } from 'packages/website/src/app/_common/api/ViewModelClient';
import { DisplayAd } from 'packages/website/src/app/_common/components/Ad/DisplayAd';
import { MultiplexAd } from 'packages/website/src/app/_common/components/Ad/MultiplexAd';
import { AdUnit } from 'packages/website/src/app/_common/components/Ad/types';
import {
  TableOfContents,
  TableOfContentsLink,
} from 'packages/website/src/app/_common/components/TableOfContents/TableOfContents';
import { CompareProductsForm } from 'packages/website/src/app/_common/product/components/CompareProductsForm/CompareProductsForm';
import React from 'react';
import { BenchmarkPerformanceAndValue } from './_components/BenchmarkPerformanceAndValue/BenchmarkPerformanceAndValue';
import { Disclaimer } from './_components/Disclaimer/Disclaimer';
import { GamingPerformance } from './_components/GamingPerformance/GamingPerformance';
import { GeneralInfo } from './_components/GeneralInfo/GeneralInfo';
import { Highlights } from './_components/Highlights/Highlights';
import { Overview } from './_components/Overview/Overview';
import { RelatedComparisons } from './_components/Related/RelatedComparisons';
import { RelatedGpus } from './_components/Related/RelatedGpus';
import { TechnicalSpecs } from './_components/TechnicalSpecs';
import { PageProvider } from './PageProvider';
import { VIEW_GPU_REDIRECTS } from './redirects';

type ViewGpuPageProps = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  props: ViewGpuPageProps,
  _metadata: ResolvingMetadata,
): Promise<Metadata> {
  const slug = props.params.slug;
  if (VIEW_GPU_REDIRECTS[slug] != null) {
    permanentRedirect(
      getViewGpuUrl({
        productType: ProductType.Gpu,
        slug: VIEW_GPU_REDIRECTS[slug],
      }),
      RedirectType.replace,
    );
  }

  const benchmark = props.searchParams.gpu_benchmark as string;
  const endpoint = joinUrlParts(
    'gpus/view',
    slug,
    `?game=${props.searchParams.game as string}`,
  );

  const viewModel = await viewModelClient.get<ViewGpuViewModel | ApiError>(
    endpoint,
    {
      normalizr: viewGpuViewModelNormalizr,
      preferredBenchmarks: { gpu: benchmark },
      headers: { Cookie: cookies().toString() },
    },
  );
  if (isNotFoundError(viewModel)) {
    throw notFound();
  } else if (isApiError(viewModel)) {
    throw viewModel;
  }

  const { gpu } = viewModel;
  const fullGpuName = formatProductName(gpu);
  const pageTitle = `${fullGpuName} GPU Benchmarks and Specs`;

  const title = `${pageTitle} - ${WEBSITE_NAME}`;
  const description =
    `Specs, benchmarks, and performance per dollar of the ${fullGpuName}. ` +
    'Our database of graphics cards will help you choose the best GPU for your computer.';
  const canonical = getViewGpuUrl(gpu);

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

export default async function ViewGpuPage(props: ViewGpuPageProps) {
  const slug = props.params.slug;
  if (VIEW_GPU_REDIRECTS[slug] != null) {
    permanentRedirect(
      getViewGpuPath({
        productType: ProductType.Gpu,
        slug: VIEW_GPU_REDIRECTS[slug],
      }),
      RedirectType.replace,
    );
  }

  const benchmark = props.searchParams.gpu_benchmark as string;
  const endpoint = joinUrlParts(
    'gpus/view',
    slug,
    `?game=${props.searchParams.game as string}`,
  );

  const viewModel = await viewModelClient.get<ViewGpuViewModel | ApiError>(
    endpoint,
    {
      normalizr: viewGpuViewModelNormalizr,
      preferredBenchmarks: { gpu: benchmark },
      headers: { Cookie: cookies().toString() },
    },
  );
  if (isNotFoundError(viewModel)) {
    throw notFound();
  } else if (isApiError(viewModel)) {
    throw viewModel;
  }

  const { gpu, relatedGpus, relatedGpuComparisons } = viewModel;
  const gpuFullName = formatProductName(gpu);

  const tableOfContents: TableOfContentsLink[] = [
    { label: 'Highlights', href: '#contents' },
    { label: 'Summary', href: '#summary' },
    { label: 'Gaming Performance', href: '#gaming-performance' },
    { label: 'Benchmark Performance', href: '#benchmark-performance' },
    { label: 'Technical Specs', href: '#tech-specs' },
    viewModel?.relatedGpus?.length
      ? { label: 'Related GPUs', href: '#related-gpus' }
      : null,
    viewModel?.relatedGpuComparisons?.length
      ? { label: 'Related Comparisons', href: '#related-comparisons' }
      : null,
  ].filter((value) => !!value);

  return (
    <PageProvider viewModel={viewModel} tableOfContents={tableOfContents}>
      <div className="flex flex-col justify-center gap-6">
        <section className="flex flex-col w-full">
          <h1 className="font-semibold mb-6">{gpuFullName}</h1>

          <CompareProductsForm
            productType={ProductType.Gpu}
            values={[gpu?.id]}
          />
        </section>

        <DisplayAd unit={AdUnit.ViewPagePreHighlightsDisplay} />

        <article
          id="contents"
          className="flex-1 flex flex-col gap-6 max-w-full"
        >
          <TableOfContents links={tableOfContents} />
          <Highlights gpu={gpu} />
          <Overview gpu={gpu} />
          <DisplayAd unit={AdUnit.ViewPagePostSummaryDisplay} />
          <GeneralInfo gpu={gpu} />
          <GamingPerformance gpu={gpu} />
          <DisplayAd unit={AdUnit.ViewPagePostGamingPerfValueDisplay} />
          <BenchmarkPerformanceAndValue gpu={gpu} />
          <DisplayAd unit={AdUnit.ViewPagePostBenchmarkPerfValueDisplay} />
          <TechnicalSpecs gpu={gpu} />
          <MultiplexAd unit={AdUnit.ViewPagePostTechSpecsMultiplex} />
          <RelatedGpus gpu={gpu} relatedGpus={relatedGpus} />
          <RelatedComparisons
            gpu={gpu}
            relatedGpuComparisons={relatedGpuComparisons}
          />
          <Disclaimer />
        </article>
      </div>
    </PageProvider>
  );
}

export const dynamic = 'force-dynamic';
