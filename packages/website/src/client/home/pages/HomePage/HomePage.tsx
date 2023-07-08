import 'reflect-metadata';
import {
  getHomePath,
  getListCpusPath,
  getListGpusPath,
  HomeViewModel,
  ListCpusPresetSlug,
  ListGpusPresetSlug,
  ProductType,
} from '@pcpartdb/shared';
import React, { useMemo } from 'react';
import { CompareProductsForm } from '../../../product/components/CompareProductsForm';
import { Seo, Tab, Tabs } from '../../../shared/components';
import { WebsiteLayout } from '../../../shared/layouts';
import { classNames } from '../../../shared/ui';
import {
  Feed,
  FeedItems,
  FeedLink,
  FeedLinks,
  ProductComparisonFeedItem,
  ProductComparisonFeedTag,
  ProductFeedItem,
  ProductFeedTag,
} from './components';

export const HomePage = (props: HomeViewModel) => {
  const { nvidiaVsAmdGpus, popularGpus, intelVsAmdCpus, popularCpus } = props;

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

  const pageTitle = 'PC hardware specifications, benchmarks, and comparisons';
  const seoTitle = `PC Part DB - ${pageTitle}`;
  const seoDescription =
    'View and compare PC component specs and benchmarks. ' +
    'Our database of PC Parts will help you choose the best parts for your computer.';
  const seoCanonical = useMemo(() => getHomePath(), []);
  const seoKeywords: string[] = [];

  return (
    <WebsiteLayout>
      <Seo
        rawTitle={seoTitle}
        keywords={seoKeywords}
        description={seoDescription}
        canonical={seoCanonical}
      />
      <section className="flex flex-col gap-8 justify-center">
        <section className={classNames('flex flex-col justify-center gap-4')}>
          <h1 className="md:text-2xl text-3xl mb-0">
            View &amp; compare PC hardware specs and benchmarks
          </h1>

          <Tabs>
            <Tab label="Graphics cards" className="px-4 py-8">
              <p>
                Select 1 or 2 graphics cards to get a comparison of their
                technical specs and benchmarks.
              </p>
              <CompareProductsForm
                productType={ProductType.Gpu}
                values={[null, null]}
              />
            </Tab>
            <Tab label="Processors" className="px-4 py-8">
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
                productType={ProductType.Gpu}
                comparison={bestPerformanceGpuComparison}
                tag={ProductComparisonFeedTag.ComparePerformance}
              />
            )}
            {bestValueGpuComparison != null && (
              <ProductComparisonFeedItem
                productType={ProductType.Gpu}
                comparison={bestValueGpuComparison}
                tag={ProductComparisonFeedTag.CompareValue}
              />
            )}
            {randomGpuComparison != null && (
              <ProductComparisonFeedItem
                productType={ProductType.Gpu}
                comparison={randomGpuComparison}
              />
            )}
          </FeedItems>

          <FeedLinks>
            <FeedLink
              href={getListGpusPath(ListGpusPresetSlug.BestPerformanceNvidia)}
            >
              Best performing NVIDIA GPUs
            </FeedLink>
            <FeedLink
              href={getListGpusPath(ListGpusPresetSlug.BestValueNvidia)}
            >
              Best value NVIDIA GPUs
            </FeedLink>
            <FeedLink
              href={getListGpusPath(ListGpusPresetSlug.BestPerformanceAmd)}
            >
              Best performing AMD GPUs
            </FeedLink>
            <FeedLink href={getListGpusPath(ListGpusPresetSlug.BestValueAmd)}>
              Best value AMD GPUs
            </FeedLink>
          </FeedLinks>
        </Feed>

        <Feed>
          <h2>Popular GPUs</h2>

          <FeedItems>
            {bestPerformanceGpu != null && (
              <ProductFeedItem
                productType={ProductType.Gpu}
                product={bestPerformanceGpu}
                tag={ProductFeedTag.GreatPerformance}
              />
            )}
            {bestValueGpu != null && (
              <ProductFeedItem
                productType={ProductType.Gpu}
                product={bestValueGpu}
                tag={ProductFeedTag.GreatValue}
              />
            )}
            {randomGpu != null && (
              <ProductFeedItem
                productType={ProductType.Gpu}
                product={randomGpu}
              />
            )}
          </FeedItems>

          <FeedLinks>
            <FeedLink
              href={getListGpusPath(ListGpusPresetSlug.BestPerformance)}
            >
              Best performing GPUs
            </FeedLink>
            <FeedLink href={getListGpusPath(ListGpusPresetSlug.BestValue)}>
              Best value GPUs
            </FeedLink>
          </FeedLinks>
        </Feed>

        <Feed>
          <h2>Intel vs AMD CPUs</h2>

          <FeedItems>
            {bestPerformanceCpuComparison != null && (
              <ProductComparisonFeedItem
                productType={ProductType.Cpu}
                comparison={bestPerformanceCpuComparison}
                tag={ProductComparisonFeedTag.ComparePerformance}
              />
            )}
            {bestValueCpuComparison != null && (
              <ProductComparisonFeedItem
                productType={ProductType.Cpu}
                comparison={bestValueCpuComparison}
                tag={ProductComparisonFeedTag.CompareValue}
              />
            )}
            {randomCpuComparison != null && (
              <ProductComparisonFeedItem
                productType={ProductType.Cpu}
                comparison={randomCpuComparison}
              />
            )}
          </FeedItems>

          <FeedLinks>
            <FeedLink
              href={getListCpusPath(ListCpusPresetSlug.BestPerformanceIntel)}
            >
              Best performing Intel CPUs
            </FeedLink>
            <FeedLink href={getListCpusPath(ListCpusPresetSlug.BestValueIntel)}>
              Best value Intel CPUs
            </FeedLink>
            <FeedLink
              href={getListCpusPath(ListCpusPresetSlug.BestPerformanceAmd)}
            >
              Best performing AMD CPUs
            </FeedLink>
            <FeedLink href={getListCpusPath(ListCpusPresetSlug.BestValueAmd)}>
              Best value AMD CPUs
            </FeedLink>
          </FeedLinks>
        </Feed>

        <Feed>
          <h2>Popular CPUs</h2>

          <FeedItems>
            {bestPerformanceCpu != null && (
              <ProductFeedItem
                productType={ProductType.Cpu}
                product={bestPerformanceCpu}
                tag={ProductFeedTag.GreatPerformance}
              />
            )}
            {bestValueCpu != null && (
              <ProductFeedItem
                productType={ProductType.Cpu}
                product={bestValueCpu}
                tag={ProductFeedTag.GreatValue}
              />
            )}
            {randomCpu != null && (
              <ProductFeedItem
                productType={ProductType.Cpu}
                product={randomCpu}
              />
            )}
          </FeedItems>

          <FeedLinks>
            <FeedLink
              href={getListCpusPath(ListCpusPresetSlug.BestPerformance)}
            >
              Best performing CPUs
            </FeedLink>
            <FeedLink href={getListCpusPath(ListCpusPresetSlug.BestValue)}>
              Best value CPUs
            </FeedLink>
          </FeedLinks>
        </Feed>
      </section>
    </WebsiteLayout>
  );
};

export default HomePage;
