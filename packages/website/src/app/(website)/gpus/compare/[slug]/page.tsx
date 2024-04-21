import {
  ApiError,
  CompareGpusViewModel,
  compareGpusViewModelNormalizr,
  formatProductComparisonName,
  formatProductName,
  getCompareGpusPath,
  getHomePath,
  getListGpusPath,
  GpuProduct,
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
import { CacheProvider } from 'packages/website/src/app/_common/cache/CacheProvider';
import { DisplayAd } from 'packages/website/src/app/_common/components/Ad/DisplayAd';
import { MultiplexAd } from 'packages/website/src/app/_common/components/Ad/MultiplexAd';
import { AdUnit } from 'packages/website/src/app/_common/components/Ad/types';
import { Breadcrumb } from 'packages/website/src/app/_common/components/Breadcrumbs/Breadcrumb';
import { Breadcrumbs } from 'packages/website/src/app/_common/components/Breadcrumbs/Breadcrumbs';
import { ViewModelType } from 'packages/website/src/app/_common/contexts/types';
import { ViewModelProvider } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { CompareProductsForm } from 'packages/website/src/app/_common/product/components/CompareProductsForm/CompareProductsForm';
import React from 'react';
import { Contents } from './_components/Contents/Contents';
import { Disclaimer } from './_components/Disclaimer/Disclaimer';
import { GamingPerformance } from './_components/GamingPerformance/GamingPerformance';
import { GeneralInfo } from './_components/GeneralInfo/GeneralInfo';
import { Highlights } from './_components/Highlights/Highlights';
import { Overview } from './_components/Overview/Overview';
import { PerformanceAndValue } from './_components/PerformanceAndValue/PerformanceAndValue';
import { RelatedComparisons } from './_components/Related/RelatedComparisons';
import { RelatedGpus } from './_components/Related/RelatedGpus';
import { RetailModels } from './_components/RetailModels/RetailModels';
import { TechnicalSpecs } from './_components/TechnicalSpecs/TechnicalSpecs';
import { PageProvider } from './PageProvider';

type CompareGpusPageProps = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  props: CompareGpusPageProps,
  parent: ResolvingMetadata,
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
  if (isApiError(viewModel)) {
    return {};
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

  return (
    <PageProvider viewModel={viewModel}>
      <Breadcrumbs className="mb-4">
        <Breadcrumb href={getHomePath()}>Home</Breadcrumb>
        <Breadcrumb href={getListGpusPath()}>Graphics Cards</Breadcrumb>
        <Breadcrumb>{shortPageTitle}</Breadcrumb>
      </Breadcrumbs>

      <div className="flex flex-col gap-6 justify-center">
        <section className="flex flex-wrap w-full">
          <h1 className="font-semibold">{pageTitle}</h1>

          <CompareProductsForm
            productType={ProductType.Gpu}
            values={[gpu1?.id, gpu2?.id]}
          />
        </section>

        <DisplayAd unit={AdUnit.ComparePagePreHighlightsDisplay} />

        <article className="flex-1 flex flex-col gap-6 max-w-full">
          <Contents />
          <Highlights comparison={comparison} />
          <Overview comparison={comparison} />
          <DisplayAd unit={AdUnit.ComparePagePostSummaryDisplay} />
          <GeneralInfo comparison={comparison} />
          <GamingPerformance comparison={comparison} />
          <DisplayAd unit={AdUnit.ComparePagePostGamingPerfValueDisplay} />
          <PerformanceAndValue comparison={comparison} />
          <DisplayAd unit={AdUnit.ComparePagePostBenchmarkPerfValueDisplay} />
          <TechnicalSpecs comparison={comparison} />
          <RetailModels comparison={comparison} />
          <MultiplexAd unit={AdUnit.ComparePagePostTechSpecsMultiplex} />
          <RelatedComparisons relatedGpuComparisons={relatedGpuComparisons} />
          <RelatedGpus relatedGpus={relatedGpus} />
          <Disclaimer />
        </article>
      </div>
    </PageProvider>
  );
}
