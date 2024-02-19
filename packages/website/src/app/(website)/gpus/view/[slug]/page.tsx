import {
  ApiError,
  formatProductName,
  getGpuChipset,
  getHomePath,
  getListGpusPath,
  getViewGpuPath,
  isApiError,
  isNotFoundError,
  joinUrlParts,
  ProductType,
  ViewGpuViewModel,
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
import { Disclaimer } from './_components/Disclaimer/Disclaimer';
import { GeneralInfo } from './_components/GeneralInfo/GeneralInfo';
import { Highlights } from './_components/Highlights/Highlights';
import { Overview } from './_components/Overview/Overview';
import { PerformanceAndValue } from './_components/PerformanceAndValue/PerformanceAndValue';
import { RelatedComparisons } from './_components/Related/RelatedComparisons';
import { RelatedGpus } from './_components/Related/RelatedGpus';
import { RetailModels } from './_components/RetailModels/RetailModels';
import { TechnicalSpecs } from './_components/TechnicalSpecs';

type ViewGpuPageProps = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  props: ViewGpuPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const slug = props.params.slug;

  const benchmark = props.searchParams.gpu_benchmark as string;
  const endpoint = joinUrlParts('gpus/view', slug);

  const viewModel = await viewModelClient.get<ViewGpuViewModel | ApiError>(
    endpoint,
    {
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

  const benchmark = props.searchParams.gpu_benchmark as string;
  const endpoint = joinUrlParts('gpus/view', slug);

  const response = await viewModelClient.get<ViewGpuViewModel | ApiError>(
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

  const { gpu, retailModels, relatedGpus, relatedGpuComparisons } = response;
  const chipset = getGpuChipset(gpu);

  const isRetailModel = gpu.parent != null;

  const chipsetShortName = formatProductName(chipset, { company: false });
  const chipsetFullName = formatProductName(chipset);
  const gpuShortName = formatProductName(gpu, { company: false });
  const gpuFullName = formatProductName(gpu);

  return (
    <CacheProvider products={[gpu, chipset]}>
      <ViewModelProvider
        type={ViewModelType.ViewGpuViewModel}
        viewModel={response}
      >
        <Breadcrumbs className="mb-4">
          <Breadcrumb href={getHomePath()}>Home</Breadcrumb>
          <Breadcrumb href={getListGpusPath()}>Graphics Cards</Breadcrumb>
          {isRetailModel && (
            <Breadcrumb href={getViewGpuPath(chipset)}>
              {chipsetShortName}
            </Breadcrumb>
          )}
          <Breadcrumb>{gpuShortName}</Breadcrumb>
        </Breadcrumbs>

        <div className="flex flex-col justify-center gap-6">
          <section className="flex flex-col w-full">
            <div className="mb-4">
              <h1 className="font-semibold mb-0">{gpuFullName}</h1>
              {isRetailModel && (
                <span className="text-sm">
                  Retail card for the{' '}
                  <a href={getViewGpuPath(chipset)}>{chipsetFullName}</a>
                </span>
              )}
            </div>

            <CompareProductsForm
              productType={ProductType.Gpu}
              values={[chipset?.id]}
            />
          </section>

          <DisplayAd unit={AdUnit.ViewPagePreHighlightsDisplay} />

          <article className="flex-1 flex flex-col gap-6 max-w-full">
            <Highlights gpu={gpu} />
            <Overview gpu={gpu} />
            <DisplayAd unit={AdUnit.ViewPagePostSummaryDisplay} />
            <GeneralInfo gpu={gpu} />
            <PerformanceAndValue />
            <DisplayAd unit={AdUnit.ViewPagePostPerfValueDisplay} />
            <TechnicalSpecs gpu={gpu} />
            <RetailModels gpu={gpu} retailModels={retailModels} />
            <MultiplexAd unit={AdUnit.ViewPagePostTechSpecsMultiplex} />
            <RelatedGpus relatedGpus={relatedGpus} />
            <RelatedComparisons relatedGpuComparisons={relatedGpuComparisons} />
            <Disclaimer />
          </article>
        </div>
      </ViewModelProvider>
    </CacheProvider>
  );
}

export const dynamic = 'force-dynamic';
