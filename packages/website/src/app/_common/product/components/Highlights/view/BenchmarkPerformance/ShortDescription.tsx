'use client';

import { getProductBenchmarkName, Product } from '@pcpartdb/shared';
import { Skeleton } from 'packages/website/src/app/_common/components/Skeleton/Skeleton';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { usePercentOf } from 'packages/website/src/app/_common/hooks/data/usePercentOf';
import React, { useMemo } from 'react';
import { useRelativeDataProducts } from '../../../../contexts/RelativeDataProductsProvider';
import { useBenchmarkValue } from '../../../../hooks/useBenchmarkValue';
import { usePreferredBenchmark } from '../../../../hooks/usePreferredBenchmark';
import { useProductName } from '../../../../hooks/useProductName';
import { useViewProductPath } from '../../../../hooks/useViewProductPath';

enum ContentTag {
  Rated,
  NotRated,
  BestPerformance,
}

const DescriptionContent = compileContentComponent(
  {
    tags: [ContentTag.Rated, ContentTag.BestPerformance],
    Component: (props) => (
      <p>
        The {props.productName} has the best performance for the{' '}
        {props.benchmarkName} benchmark.
      </p>
    ),
  },
  {
    tags: [ContentTag.Rated],
    Component: (props) => (
      <p>
        The {props.productName} has {props.percentOfBestLabel} of the
        performance compared to the leader for the {props.benchmarkName}{' '}
        benchmark:{' '}
        <a href={props.bestProductUrl} target="_blank">
          {props.bestProductName}
        </a>
        .
      </p>
    ),
  },
  {
    tags: [ContentTag.NotRated],
    Component: (props) => (
      <p>
        We do not have performance data for the {props.productName} for the{' '}
        {props.benchmarkName} benchmark.
      </p>
    ),
  },
);

interface ShortDescriptionProps {
  product: Partial<Product>;
}

export const ShortDescription = (props: ShortDescriptionProps) => {
  const tags = useDescriptionTags(props);
  const params = useDescriptionParams(props);
  const { loading } = useRelativeDataProducts();

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="w-full" pulse />
        <Skeleton className="w-full" pulse />
      </div>
    );
  }

  return (
    <ContentProvider tags={tags} params={params}>
      <div className="-mb-4">
        <DescriptionContent />
      </div>
    </ContentProvider>
  );
};

interface UseDescriptionTagsArgs {
  product: Partial<Product>;
}

function useDescriptionTags(args: UseDescriptionTagsArgs) {
  const { product } = args;

  const productType = product.productType;
  const preferredBenchmark = usePreferredBenchmark(productType);
  const { relativeDataProducts } = useRelativeDataProducts();
  const bestProduct = relativeDataProducts?.bestBenchmarkPerformance;

  const score = useBenchmarkValue(product, preferredBenchmark);
  const bestScore = useBenchmarkValue(bestProduct, preferredBenchmark);

  return useMemo(() => {
    const tags: ContentTag[] = [];

    if (score != null) {
      tags.push(ContentTag.Rated);
    } else {
      tags.push(ContentTag.NotRated);
    }

    if (score === bestScore) {
      tags.push(ContentTag.BestPerformance);
    }

    return tags;
  }, [bestScore, score]);
}

interface UseDescriptionParamsArgs {
  product: Partial<Product>;
}

function useDescriptionParams(args: UseDescriptionParamsArgs) {
  const { product } = args;

  const productType = product.productType;
  const preferredBenchmark = usePreferredBenchmark(productType);
  const { relativeDataProducts } = useRelativeDataProducts();
  const bestProduct = relativeDataProducts?.bestBenchmarkPerformance;

  const productName = useProductName(product, { company: false });
  const score = useBenchmarkValue(product, preferredBenchmark);
  const bestScore = useBenchmarkValue(bestProduct, preferredBenchmark);
  const percentOfBest = usePercentOf(score, bestScore);
  const bestProductName = useProductName(bestProduct);
  const bestProductUrl = useViewProductPath(bestProduct);
  const benchmarkName = getProductBenchmarkName(preferredBenchmark);

  const percentOfBestLabel = `${percentOfBest?.toFixed(0)}%`;

  return {
    productName,
    bestProductName,
    bestProductUrl,
    percentOfBestLabel,
    benchmarkName,
  };
}
