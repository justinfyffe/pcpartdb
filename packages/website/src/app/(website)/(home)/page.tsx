import {
  ApiError,
  getHomeUrl,
  HomeViewModel,
  isApiError,
  isNotFoundError,
  ProductType,
  WEBSITE_NAME,
} from '@pcpartdb/shared';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import { viewModelClient } from '../../_common/api/ViewModelClient';
import { ComparisonFormSection } from './_components/ComparisonFormSection/ComparisonFormSection';
import { ProductComparisonsSection } from './_components/ProductComparisonsSection/ProductComparisonsSection';
import { ProductListSection } from './_components/ProductListSection/ProductListSection';
import { PageProvider } from './PageProvider';

const TITLE = 'GPU and CPU benchmarks, specs, and comparisons';

export const metadata: Metadata = {
  title: `${TITLE} - ${WEBSITE_NAME}`,
  description:
    'View and compare PC part benchmarks and specs. ' +
    'Our database of PC parts will help you choose the best parts for your computer.',
  alternates: {
    canonical: getHomeUrl(),
  },
};

export default async function HomePage() {
  const viewModel = await viewModelClient.get<HomeViewModel | ApiError>('home');
  if (isNotFoundError(viewModel)) {
    throw notFound();
  } else if (isApiError(viewModel)) {
    throw viewModel;
  }

  return (
    <PageProvider viewModel={viewModel}>
      <section className="flex flex-col gap-8 justify-center">
        <ComparisonFormSection />

        <div className="flex flex-wrap md:flex-col gap-8">
          <section className="flex-1 flex flex-col gap-8">
            <ProductListSection productType={ProductType.Gpu} />
            <ProductComparisonsSection
              productType={ProductType.Gpu}
              title="NVIDIA vs AMD GPUs"
            />
          </section>

          <section className="flex-1 flex flex-col gap-8">
            <ProductListSection productType={ProductType.Cpu} />
            <ProductComparisonsSection
              productType={ProductType.Cpu}
              title="Intel vs AMD CPUs"
            />
          </section>
        </div>
      </section>
    </PageProvider>
  );
}

export const dynamic = 'force-dynamic';
