import {
  ApiError,
  getHomePath,
  getListCpusPath,
  getListGpusPath,
  HomeViewModel,
  isApiError,
  isNotFoundError,
  ListCpusPresetSlug,
  ListGpusPresetSlug,
  ProductType,
  WEBSITE_NAME,
} from '@pcpartdb/shared';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import { viewModelClient } from '../../_common/api/ViewModelClient';
import { Tab } from '../../_common/components/Tabs/Tab';
import { Tabs } from '../../_common/components/Tabs/Tabs';
import { TabsVariant } from '../../_common/components/Tabs/types';
import { CompareProductsForm } from '../../_common/product/components/CompareProductsForm/CompareProductsForm';
import { classNames } from '../../_common/utils/classNames';
import { Feed } from './_components/Feed/Feed';
import { FeedItems } from './_components/Feed/FeedItems';
import { FeedLinks } from './_components/Feed/FeedLinks';
import { ProductComparisonFeedItem } from './_components/Feed/ProductComparisonFeedItem';
import { ProductFeedItem } from './_components/Feed/ProductFeedItem';
import {
  ProductComparisonFeedTag,
  ProductFeedTag,
} from './_components/Feed/types';

const TITLE = 'GPU and CPU benchmarks, specs, and comparisons';

export const metadata: Metadata = {
  title: `${TITLE} - ${WEBSITE_NAME}`,
  description:
    'View and compare PC part benchmarks and specs. ' +
    'Our database of PC parts will help you choose the best parts for your computer.',
  alternates: {
    canonical: getHomePath(),
  },
};

export default async function HomePage() {
  const viewModel = await viewModelClient.get<HomeViewModel | ApiError>('home');
  if (isNotFoundError(viewModel)) {
    throw notFound();
  } else if (isApiError(viewModel)) {
    throw viewModel;
  }

  const { nvidiaVsAmdGpus, popularGpus, intelVsAmdCpus, popularCpus } =
    viewModel;

  const [
    bestPerformanceGpuComparison,
    bestValueGpuComparison,
    randomGpuComparison,
  ] = nvidiaVsAmdGpus;
  const [bestPerformanceGpu, bestValueGpu, randomGpu] = popularGpus;
  const [
    bestPerformanceCpuComparison,
    bestValueCpuComparison,
    randomCpuComparison,
  ] = intelVsAmdCpus;
  const [bestPerformanceCpu, bestValueCpu, randomCpu] = popularCpus;

  return (
    <>
      <section className="flex flex-col gap-8 justify-center">
        {' '}
        <section className={classNames('flex flex-col justify-center gap-4')}>
          <h1 className="md:text-2xl text-3xl mb-0">
            View &amp; compare PC part benchmarks and specs
          </h1>

          <Tabs variant={TabsVariant.Horizontal}>
            <Tab label="Graphics cards" className="py-4">
              <p>
                Select 1 or 2 graphics cards to get a comparison of their
                technical specs and benchmarks.
              </p>
              <CompareProductsForm
                productType={ProductType.Gpu}
                values={[null, null]}
              />
            </Tab>
            <Tab label="Processors" className="py-4">
              <p>
                Select 1 or 2 processors to get a comparison of their technical
                specs and benchmarks.
              </p>
              <CompareProductsForm
                productType={ProductType.Cpu}
                values={[null, null]}
              />
            </Tab>
          </Tabs>
        </section>
        <Feed>
          <h2>NVIDIA vs AMD GPUs</h2>

          <FeedItems>
            {bestPerformanceGpuComparison != null && (
              <ProductComparisonFeedItem
                comparison={bestPerformanceGpuComparison}
                tag={ProductComparisonFeedTag.ComparePerformance}
              />
            )}
            {bestValueGpuComparison != null && (
              <ProductComparisonFeedItem
                comparison={bestValueGpuComparison}
                tag={ProductComparisonFeedTag.CompareValue}
              />
            )}
            {randomGpuComparison != null && (
              <ProductComparisonFeedItem comparison={randomGpuComparison} />
            )}
          </FeedItems>

          <FeedLinks>
            <a href={getListGpusPath(ListGpusPresetSlug.BestPerformanceNvidia)}>
              Best performing NVIDIA GPUs
            </a>
            <a
              href={getListGpusPath(
                ListGpusPresetSlug.BestPerformancePerDollarNvidia,
              )}
            >
              Best performance per dollar NVIDIA GPUs
            </a>
            <a href={getListGpusPath(ListGpusPresetSlug.BestPerformanceAmd)}>
              Best performing AMD GPUs
            </a>
            <a
              href={getListGpusPath(
                ListGpusPresetSlug.BestPerformancePerDollarAmd,
              )}
            >
              Best performance per dollar AMD GPUs
            </a>
          </FeedLinks>
        </Feed>
        <Feed>
          <h2>Popular GPUs</h2>

          <FeedItems>
            {bestPerformanceGpu != null && (
              <ProductFeedItem
                product={bestPerformanceGpu}
                tag={ProductFeedTag.GreatPerformance}
              />
            )}
            {bestValueGpu != null && (
              <ProductFeedItem
                product={bestValueGpu}
                tag={ProductFeedTag.GreatValue}
              />
            )}
            {randomGpu != null && <ProductFeedItem product={randomGpu} />}
          </FeedItems>

          <FeedLinks>
            <a href={getListGpusPath(ListGpusPresetSlug.BestPerformance)}>
              Best performing GPUs
            </a>
            <a
              href={getListGpusPath(
                ListGpusPresetSlug.BestPerformancePerDollar,
              )}
            >
              Best performance per dollar GPUs
            </a>
          </FeedLinks>
        </Feed>
        <Feed>
          <h2>Intel vs AMD CPUs</h2>

          <FeedItems>
            {bestPerformanceCpuComparison != null && (
              <ProductComparisonFeedItem
                comparison={bestPerformanceCpuComparison}
                tag={ProductComparisonFeedTag.ComparePerformance}
              />
            )}
            {bestValueCpuComparison != null && (
              <ProductComparisonFeedItem
                comparison={bestValueCpuComparison}
                tag={ProductComparisonFeedTag.CompareValue}
              />
            )}
            {randomCpuComparison != null && (
              <ProductComparisonFeedItem comparison={randomCpuComparison} />
            )}
          </FeedItems>

          <FeedLinks>
            <a href={getListCpusPath(ListCpusPresetSlug.BestPerformanceIntel)}>
              Best performing Intel CPUs
            </a>
            <a
              href={getListCpusPath(
                ListCpusPresetSlug.BestPerformancePerDollarIntel,
              )}
            >
              Best performance per dollar Intel CPUs
            </a>
            <a href={getListCpusPath(ListCpusPresetSlug.BestPerformanceAmd)}>
              Best performing AMD CPUs
            </a>
            <a
              href={getListCpusPath(
                ListCpusPresetSlug.BestPerformancePerDollarAmd,
              )}
            >
              Best performance per dollar AMD CPUs
            </a>
          </FeedLinks>
        </Feed>
        <Feed>
          <h2>Popular CPUs</h2>

          <FeedItems>
            {bestPerformanceCpu != null && (
              <ProductFeedItem
                product={bestPerformanceCpu}
                tag={ProductFeedTag.GreatPerformance}
              />
            )}
            {bestValueCpu != null && (
              <ProductFeedItem
                product={bestValueCpu}
                tag={ProductFeedTag.GreatValue}
              />
            )}
            {randomCpu != null && <ProductFeedItem product={randomCpu} />}
          </FeedItems>

          <FeedLinks>
            <a href={getListCpusPath(ListCpusPresetSlug.BestPerformance)}>
              Best performing CPUs
            </a>
            <a
              href={getListCpusPath(
                ListCpusPresetSlug.BestPerformancePerDollar,
              )}
            >
              Best performance per dollar CPUs
            </a>
          </FeedLinks>
        </Feed>
      </section>
    </>
  );
}

export const dynamic = 'force-dynamic';
