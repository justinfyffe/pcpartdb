import {
  ApiError,
  formatProductName,
  getHomePath,
  getListCpusPath,
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
import { Breadcrumb } from 'packages/website/src/app/_common/components/Breadcrumbs/Breadcrumb';
import { Breadcrumbs } from 'packages/website/src/app/_common/components/Breadcrumbs/Breadcrumbs';
import { CompareProductsForm } from 'packages/website/src/app/_common/product/components/CompareProductsForm/CompareProductsForm';
import React from 'react';
import { Contents } from './_components/Contents/Contents';
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
  metadata: ResolvingMetadata,
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
  if (isApiError(viewModel)) {
    return {};
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

  return (
    <PageProvider viewModel={viewModel}>
      <Breadcrumbs className="mb-4">
        <Breadcrumb href={getHomePath()}>Home</Breadcrumb>
        <Breadcrumb href={getListCpusPath()}>Processors</Breadcrumb>
        <Breadcrumb>{cpuShortName}</Breadcrumb>
      </Breadcrumbs>

      <div className="flex flex-col justify-center gap-6">
        <section className="flex flex-col w-full">
          <h1 className="font-semibold">{cpuName}</h1>
          <CompareProductsForm
            productType={ProductType.Cpu}
            values={[cpu?.id]}
          />
        </section>

        <DisplayAd unit={AdUnit.ViewPagePreHighlightsDisplay} />

        <article className="flex-1 flex flex-col gap-6 max-w-full">
          <Contents />
          <Highlights cpu={cpu} />
          <Overview cpu={cpu} />
          <DisplayAd unit={AdUnit.ViewPagePostSummaryDisplay} />
          <GeneralInfo cpu={cpu} />
          <PerformanceAndValue cpu={cpu} />
          <DisplayAd unit={AdUnit.ViewPagePostBenchmarkPerfValueDisplay} />
          <TechnicalSpecs cpu={cpu} />
          <MultiplexAd unit={AdUnit.ViewPagePostTechSpecsMultiplex} />
          <RelatedCpus relatedCpus={relatedCpus} />
          <RelatedComparisons relatedComparisons={relatedCpuComparisons} />
          <Disclaimer />
        </article>
      </div>
    </PageProvider>
  );
}
