import {
  ApiError,
  CompareGpusViewModel,
  compareGpusViewModelNormalizr,
  formatProductComparisonName,
  formatProductName,
  getCompareGpusPath,
  isApiError,
  isNotFoundError,
  joinUrlParts,
  ProductType,
  WEBSITE_NAME,
} from '@pcpartdb/shared';
import { Metadata, ResolvingMetadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
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
import { Disclaimer } from './_components/Disclaimer/Disclaimer';
import { GamingPerformance } from './_components/GamingPerformance/GamingPerformance';
import { GeneralInfo } from './_components/GeneralInfo/GeneralInfo';
import { Highlights } from './_components/Highlights/Highlights';
import { Overview } from './_components/Overview/Overview';
import { PerformanceAndValue } from './_components/PerformanceAndValue/PerformanceAndValue';
import { RelatedComparisons } from './_components/Related/RelatedComparisons';
import { RelatedGpus } from './_components/Related/RelatedGpus';
import { TechnicalSpecs } from './_components/TechnicalSpecs/TechnicalSpecs';
import { PageProvider } from './PageProvider';

type CompareGpusPageProps = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  props: CompareGpusPageProps,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const slug = props.params.slug;

  const benchmark = props.searchParams.gpu_benchmark as string;
  const endpoint = joinUrlParts(
    'gpus/compare',
    slug,
    `?game=${props.searchParams.game as string}`,
  );

  const viewModel = await viewModelClient.get<CompareGpusViewModel | ApiError>(
    endpoint,
    {
      normalizr: compareGpusViewModelNormalizr,
      preferredBenchmarks: { gpu: benchmark },
      headers: { Cookie: cookies().toString() },
    },
  );
  if (isNotFoundError(viewModel)) {
    throw notFound();
  } else if (isApiError(viewModel)) {
    throw viewModel;
  }

  const { comparison } = viewModel;
  const [gpu1, gpu2] = comparison;

  const title = `${formatProductComparisonName(comparison, {
    company: false,
  })}: Compare specs, performance, and value`;

  const shortestGpuName1 = formatProductName(gpu1, {
    company: false,
    brand: false,
  });
  const shortestGpuName2 = formatProductName(gpu2, {
    company: false,
    brand: false,
  });

  const description =
    `Compare the specs, benchmarks, and performance per dollar of the ${shortestGpuName1} and ${shortestGpuName2}. ` +
    'Our database of graphics cards will help you choose the best GPU for your computer.';

  return {
    title: `${title} - ${WEBSITE_NAME}`,
    description,
    alternates: {
      canonical: getCompareGpusPath({ comparison }),
    },
  };
}

export default async function CompareGpusPage(props: CompareGpusPageProps) {
  const slug = props.params.slug;
  const benchmark = props.searchParams.gpu_benchmark as string;
  const endpoint = joinUrlParts(
    'gpus/compare',
    slug,
    `?game=${props.searchParams.game as string}`,
  );

  const viewModel = await viewModelClient.get<CompareGpusViewModel | ApiError>(
    endpoint,
    {
      normalizr: compareGpusViewModelNormalizr,
      preferredBenchmarks: { gpu: benchmark },
      headers: { Cookie: cookies().toString() },
    },
  );
  if (isNotFoundError(viewModel)) {
    throw notFound();
  } else if (isApiError(viewModel)) {
    throw viewModel;
  }

  const { comparison, relatedGpuComparisons, relatedGpus } = viewModel;
  const [gpu1, gpu2] = comparison;

  const pageTitle = formatProductComparisonName(comparison);
  const shortPageTitle = formatProductComparisonName(comparison, {
    company: false,
  });

  const tableOfContents: TableOfContentsLink[] = [
    { label: 'Highlights', href: '#contents' },
    { label: 'Summary', href: '#summary' },
    { label: 'Gaming Performance', href: '#gaming-performance' },
    { label: 'Benchmark Performance', href: '#benchmark-performance' },
    { label: 'Technical Specs', href: '#tech-specs' },
    viewModel?.relatedGpuComparisons?.length
      ? { label: 'Related Comparisons', href: '#related-comparisons' }
      : null,
    viewModel?.relatedGpus?.length
      ? { label: 'Related GPUs', href: '#related-gpus' }
      : null,
  ].filter((value) => !!value);

  return (
    <PageProvider viewModel={viewModel} tableOfContents={tableOfContents}>
      <div className="flex flex-col gap-6 justify-center">
        <section className="flex flex-wrap w-full">
          <h1 className="font-semibold mb-6">{pageTitle}</h1>

          <CompareProductsForm
            productType={ProductType.Gpu}
            values={[gpu1?.id, gpu2?.id]}
          />
        </section>

        <DisplayAd unit={AdUnit.ComparePagePreHighlightsDisplay} />

        <article
          id="contents"
          className="flex-1 flex flex-col gap-6 max-w-full"
        >
          <TableOfContents links={tableOfContents} />
          <Highlights comparison={comparison} />
          <Overview comparison={comparison} />
          <DisplayAd unit={AdUnit.ComparePagePostSummaryDisplay} />
          <GeneralInfo comparison={comparison} />
          <GamingPerformance comparison={comparison} />
          <DisplayAd unit={AdUnit.ComparePagePostGamingPerfValueDisplay} />
          <PerformanceAndValue comparison={comparison} />
          <DisplayAd unit={AdUnit.ComparePagePostBenchmarkPerfValueDisplay} />
          <TechnicalSpecs comparison={comparison} />
          <MultiplexAd unit={AdUnit.ComparePagePostTechSpecsMultiplex} />
          <RelatedComparisons relatedGpuComparisons={relatedGpuComparisons} />
          <RelatedGpus relatedGpus={relatedGpus} />
          <Disclaimer />
        </article>
      </div>
    </PageProvider>
  );
}
