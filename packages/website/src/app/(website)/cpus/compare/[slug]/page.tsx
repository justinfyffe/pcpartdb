import {
  ApiError,
  CompareCpusViewModel,
  compareCpusViewModelNormalizr,
  formatProductComparisonName,
  formatProductName,
  getCompareCpusUrl,
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
import {
  TableOfContents,
  TableOfContentsLink,
} from 'packages/website/src/app/_common/components/TableOfContents/TableOfContents';
import React from 'react';
import { DisplayAd } from '../../../../_common/components/Ad/DisplayAd';
import { MultiplexAd } from '../../../../_common/components/Ad/MultiplexAd';
import { AdUnit } from '../../../../_common/components/Ad/types';
import { CompareProductsForm } from '../../../../_common/product/components/CompareProductsForm/CompareProductsForm';
import { Disclaimer } from './_components/Disclaimer/Disclaimer';
import { GeneralInfo } from './_components/GeneralInfo';
import { Highlights } from './_components/Highlights/Highlights';
import { Overview } from './_components/Overview/Overview';
import { PerformanceAndValue } from './_components/PerformanceAndValue/PerformanceAndValue';
import { RelatedComparisons } from './_components/Related/RelatedComparisons';
import { RelatedCpus } from './_components/Related/RelatedCpus';
import { TechnicalSpecs } from './_components/TechnicalSpecs/TechnicalSpecs';
import { PageProvider } from './PageProvider';

type CompareCpusPageProps = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  props: CompareCpusPageProps,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const slug = props.params.slug;

  const benchmark = props.searchParams.cpu_benchmark as string;
  const endpoint = joinUrlParts('cpus/compare', slug);

  const viewModel = await viewModelClient.get<CompareCpusViewModel | ApiError>(
    endpoint,
    {
      normalizr: compareCpusViewModelNormalizr,
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
  const [cpu1, cpu2] = comparison;

  const title = `${formatProductComparisonName(comparison, {
    company: false,
  })}: Compare specs, performance, and value`;

  const shortestGpuName1 = formatProductName(cpu1, {
    company: false,
    brand: false,
  });
  const shortestGpuName2 = formatProductName(cpu2, {
    company: false,
    brand: false,
  });

  const description =
    `Compare the specs, benchmarks, and performance per dollar of the ${shortestGpuName1} and ${shortestGpuName2}. ` +
    'Our database of processors will help you choose the best CPU for your computer.';

  return {
    title: `${title} - ${WEBSITE_NAME}`,
    description,
    alternates: {
      canonical: getCompareCpusUrl({ comparison }),
    },
  };
}

export default async function CompareCpusPage(props: CompareCpusPageProps) {
  const slug = props.params.slug;
  const benchmark = props.searchParams.cpu_benchmark as string;
  const endpoint = joinUrlParts('cpus/compare', slug);

  const viewModel = await viewModelClient.get<CompareCpusViewModel | ApiError>(
    endpoint,
    {
      normalizr: compareCpusViewModelNormalizr,
      preferredBenchmarks: { gpu: benchmark },
      headers: { Cookie: cookies().toString() },
    },
  );
  if (isNotFoundError(viewModel)) {
    throw notFound();
  } else if (isApiError(viewModel)) {
    throw viewModel;
  }

  const { comparison, relatedCpuComparisons, relatedCpus } = viewModel;
  const [cpu1, cpu2] = comparison;

  const pageTitle = formatProductComparisonName(comparison);
  const shortPageTitle = formatProductComparisonName(comparison, {
    company: false,
  });

  const tableOfContents: TableOfContentsLink[] = [
    { label: 'Highlights', href: '#contents' },
    { label: 'Summary', href: '#summary' },
    { label: 'Benchmark Performance', href: '#benchmark-performance' },
    { label: 'Technical Specs', href: '#tech-specs' },
    viewModel?.relatedCpuComparisons?.length
      ? { label: 'Related Comparisons', href: '#related-comparisons' }
      : null,
    viewModel?.relatedCpus?.length
      ? { label: 'Related CPUs', href: '#related-cpus' }
      : null,
  ].filter((value) => !!value);

  return (
    <PageProvider viewModel={viewModel} tableOfContents={tableOfContents}>
      <div className="flex flex-col gap-6 justify-center">
        <section className="flex flex-wrap w-full">
          <h1 className="font-semibold mb-6">{pageTitle}</h1>

          <CompareProductsForm
            productType={ProductType.Cpu}
            values={[cpu1?.id, cpu2?.id]}
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
          <PerformanceAndValue comparison={comparison} />
          <DisplayAd unit={AdUnit.ComparePagePostBenchmarkPerfValueDisplay} />
          <TechnicalSpecs comparison={comparison} />
          <MultiplexAd unit={AdUnit.ComparePagePostTechSpecsMultiplex} />
          <RelatedComparisons relatedComparisons={relatedCpuComparisons} />
          <RelatedCpus relatedCpus={relatedCpus} />
          <Disclaimer />
        </article>
      </div>
    </PageProvider>
  );
}
