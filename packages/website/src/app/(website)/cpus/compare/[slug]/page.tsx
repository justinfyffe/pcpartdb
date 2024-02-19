import {
  ApiError,
  CompareCpusViewModel,
  formatProductComparisonName,
  formatProductName,
  getCompareCpusPath,
  getHomePath,
  getListCpusPath,
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
import React from 'react';
import { CacheProvider } from '../../../../_common/cache/CacheProvider';
import { DisplayAd } from '../../../../_common/components/Ad/DisplayAd';
import { MultiplexAd } from '../../../../_common/components/Ad/MultiplexAd';
import { AdUnit } from '../../../../_common/components/Ad/types';
import { Breadcrumb } from '../../../../_common/components/Breadcrumbs/Breadcrumb';
import { Breadcrumbs } from '../../../../_common/components/Breadcrumbs/Breadcrumbs';
import { ViewModelType } from '../../../../_common/contexts/types';
import { ViewModelProvider } from '../../../../_common/contexts/ViewModelProvider';
import { CompareProductsForm } from '../../../../_common/product/components/CompareProductsForm/CompareProductsForm';
import { Disclaimer } from './_components/Disclaimer/Disclaimer';
import { GeneralInfo } from './_components/GeneralInfo';
import { Highlights } from './_components/Highlights/Highlights';
import { Overview } from './_components/Overview/Overview';
import { PerformanceAndValue } from './_components/PerformanceAndValue/PerformanceAndValue';
import { RelatedComparisons } from './_components/Related/RelatedComparisons';
import { RelatedCpus } from './_components/Related/RelatedCpus';
import { TechnicalSpecs } from './_components/TechnicalSpecs/TechnicalSpecs';

type CompareCpusPageProps = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  props: CompareCpusPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const slug = props.params.slug;

  const benchmark = props.searchParams.cpu_benchmark as string;
  const endpoint = joinUrlParts('cpus/compare', slug);

  const viewModel = await viewModelClient.get<CompareCpusViewModel | ApiError>(
    endpoint,
    {
      preferredBenchmarks: { gpu: benchmark },
      headers: { Cookie: cookies().toString() },
    },
  );
  if (isApiError(viewModel)) {
    return {};
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
      canonical: getCompareCpusPath({ comparison }),
    },
  };
}

export default async function CompareCpusPage(props: CompareCpusPageProps) {
  const slug = props.params.slug;
  const benchmark = props.searchParams.cpu_benchmark as string;
  const endpoint = joinUrlParts('cpus/compare', slug);

  const response = await viewModelClient.get<CompareCpusViewModel | ApiError>(
    endpoint,
    {
      preferredBenchmarks: { gpu: benchmark },
      headers: { Cookie: cookies().toString() },
    },
  );
  if (isNotFoundError(response)) {
    throw notFound();
  } else if (isApiError(response)) {
    throw response;
  }

  const { comparison, relatedCpuComparisons, relatedCpus } = response;
  const [cpu1, cpu2] = comparison;

  const pageTitle = formatProductComparisonName(comparison);
  const shortPageTitle = formatProductComparisonName(comparison, {
    company: false,
  });

  return (
    <CacheProvider products={[cpu1, cpu2]}>
      <ViewModelProvider
        type={ViewModelType.CompareCpusViewModel}
        viewModel={response}
      >
        <Breadcrumbs className="mb-4">
          <Breadcrumb href={getHomePath()}>Home</Breadcrumb>
          <Breadcrumb href={getListCpusPath()}>Processors</Breadcrumb>
          <Breadcrumb>{shortPageTitle}</Breadcrumb>
        </Breadcrumbs>

        <div className="flex flex-col gap-6 justify-center">
          <section className="flex flex-wrap w-full">
            <h1 className="font-semibold">{pageTitle}</h1>

            <CompareProductsForm
              productType={ProductType.Cpu}
              values={[cpu1?.id, cpu2?.id]}
            />
          </section>

          <DisplayAd unit={AdUnit.ComparePagePreHighlightsDisplay} />

          <article className="flex-1 flex flex-col gap-6 max-w-full">
            <Highlights comparison={comparison} />
            <Overview comparison={comparison} />
            <DisplayAd unit={AdUnit.ComparePagePostSummaryDisplay} />
            <GeneralInfo comparison={comparison} />
            <PerformanceAndValue />
            <DisplayAd unit={AdUnit.ComparePagePostPerfValueDisplay} />
            <TechnicalSpecs comparison={comparison} />
            <MultiplexAd unit={AdUnit.ComparePagePostTechSpecsMultiplex} />
            <RelatedComparisons relatedComparisons={relatedCpuComparisons} />
            <RelatedCpus relatedCpus={relatedCpus} />
            <Disclaimer />
          </article>
        </div>
      </ViewModelProvider>
    </CacheProvider>
  );
}
