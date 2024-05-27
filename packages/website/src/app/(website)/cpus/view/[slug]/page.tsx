import {
  ApiError,
  formatProductName,
  getViewCpuPath,
  isApiError,
  isNotFoundError,
  joinUrlParts,
  ProductType,
  ViewCpuViewModel,
  viewCpuViewModelNormalizr,
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
import { GeneralInfo } from './_components/GeneralInfo/GeneralInfo';
import { Highlights } from './_components/Highlights/Highlights';
import { Overview } from './_components/Overview/Overview';
import { PerformanceAndValue } from './_components/PerformanceAndValue/PerformanceAndValue';
import { RelatedComparisons } from './_components/Related/RelatedComparisons';
import { RelatedCpus } from './_components/Related/RelatedCpus';
import { TechnicalSpecs } from './_components/TechnicalSpecs/TechnicalSpecs';
import { PageProvider } from './PageProvider';

type ViewCpuPageProps = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  props: ViewCpuPageProps,
  _metadata: ResolvingMetadata,
): Promise<Metadata> {
  const slug = props.params.slug;

  const benchmark = props.searchParams.cpu_benchmark as string;
  const endpoint = joinUrlParts('cpus/view', slug);

  const viewModel = await viewModelClient.get<ViewCpuViewModel | ApiError>(
    endpoint,
    {
      normalizr: viewCpuViewModelNormalizr,
      preferredBenchmarks: { cpu: benchmark },
      headers: { Cookie: cookies().toString() },
    },
  );
  if (isNotFoundError(viewModel)) {
    throw notFound();
  } else if (isApiError(viewModel)) {
    throw viewModel;
  }

  const { cpu } = viewModel;
  const fullCpuName = formatProductName(cpu);
  const title = `${fullCpuName} CPU Benchmarks and Specs`;
  const description =
    `Specs, benchmarks, and performance per dollar of the ${fullCpuName}. ` +
    'Our database of processors will help you choose the best CPU for your computer.';

  return {
    title: `${title} - ${WEBSITE_NAME}`,
    description,
    alternates: {
      canonical: getViewCpuPath(cpu),
    },
  };
}

export default async function ViewCpuPage(props: ViewCpuPageProps) {
  const slug = props.params.slug;

  const benchmark = props.searchParams.cpu_benchmark as string;
  const endpoint = joinUrlParts('cpus/view', slug);

  const viewModel = await viewModelClient.get<ViewCpuViewModel | ApiError>(
    endpoint,
    {
      normalizr: viewCpuViewModelNormalizr,
      preferredBenchmarks: { cpu: benchmark },
      headers: { Cookie: cookies().toString() },
    },
  );
  if (isNotFoundError(viewModel)) {
    throw notFound();
  } else if (isApiError(viewModel)) {
    throw viewModel;
  }

  const { cpu, relatedCpus, relatedCpuComparisons } = viewModel;

  const cpuName = formatProductName(cpu);
  const cpuShortName = formatProductName(cpu, { company: false });

  const tableOfContents: TableOfContentsLink[] = [
    { label: 'Highlights', href: '#contents' },
    { label: 'Summary', href: '#summary' },
    { label: 'Benchmark Performance', href: '#benchmark-performance' },
    { label: 'Technical Specs', href: '#tech-specs' },
    viewModel?.relatedCpus?.length
      ? { label: 'Related CPUs', href: '#related-cpus' }
      : null,
    viewModel?.relatedCpuComparisons?.length
      ? { label: 'Related Comparisons', href: '#related-comparisons' }
      : null,
  ].filter((value) => !!value);

  return (
    <PageProvider viewModel={viewModel} tableOfContents={tableOfContents}>
      <div className="flex flex-col justify-center gap-6">
        <section className="flex flex-col w-full">
          <h1 className="font-semibold mb-6">{cpuName}</h1>
          <CompareProductsForm
            productType={ProductType.Cpu}
            values={[cpu?.id]}
          />
        </section>

        <DisplayAd unit={AdUnit.ViewPagePreHighlightsDisplay} />

        <article
          id="contents"
          className="flex-1 flex flex-col gap-6 max-w-full"
        >
          <TableOfContents links={tableOfContents} />
          <Highlights cpu={cpu} />
          <Overview cpu={cpu} />
          <DisplayAd unit={AdUnit.ViewPagePostSummaryDisplay} />
          <GeneralInfo cpu={cpu} />
          <PerformanceAndValue cpu={cpu} />
          <DisplayAd unit={AdUnit.ViewPagePostBenchmarkPerfValueDisplay} />
          <TechnicalSpecs cpu={cpu} />
          <MultiplexAd unit={AdUnit.ViewPagePostTechSpecsMultiplex} />
          <RelatedCpus cpu={cpu} relatedCpus={relatedCpus} />
          <RelatedComparisons relatedComparisons={relatedCpuComparisons} />
          <Disclaimer />
        </article>
      </div>
    </PageProvider>
  );
}
