import {
  ApiError,
  formatProductName,
  getHomePath,
  getListGpusPath,
  getViewGpuPath,
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
import { Breadcrumb } from 'packages/website/src/app/_common/components/Breadcrumbs/Breadcrumb';
import { Breadcrumbs } from 'packages/website/src/app/_common/components/Breadcrumbs/Breadcrumbs';
import { CompareProductsForm } from 'packages/website/src/app/_common/product/components/CompareProductsForm/CompareProductsForm';
import React from 'react';
import { BenchmarkPerformanceAndValue } from './_components/BenchmarkPerformanceAndValue/BenchmarkPerformanceAndValue';
import { Contents } from './_components/Contents/Contents';
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
  if (isApiError(viewModel)) {
    return {};
  }

  const { gpu } = viewModel;
  const fullGpuName = formatProductName(gpu);
  const title = `${fullGpuName} GPU Benchmarks and Specs`;
  const description =
    `Specs, benchmarks, and performance per dollar of the ${fullGpuName}. ` +
    'Our database of graphics cards will help you choose the best GPU for your computer.';

  return {
    title: `${title} - ${WEBSITE_NAME}`,
    description,
    alternates: {
      canonical: getViewGpuPath(gpu),
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

  const gpuShortName = formatProductName(gpu, { company: false });
  const gpuFullName = formatProductName(gpu);

  return (
    <PageProvider viewModel={viewModel}>
      <Breadcrumbs className="mb-4">
        <Breadcrumb href={getHomePath()}>Home</Breadcrumb>
        <Breadcrumb href={getListGpusPath()}>Graphics Cards</Breadcrumb>
        <Breadcrumb>{gpuShortName}</Breadcrumb>
      </Breadcrumbs>

      <div className="flex flex-col justify-center gap-6">
        <section className="flex flex-col w-full">
          <div className="mb-4">
            <h1 className="font-semibold mb-0">{gpuFullName}</h1>
          </div>

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
          <Contents />
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
