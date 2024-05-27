'use client';

import { getProductBenchmarkName, Product } from '@pcpartdb/shared';
import { Skeleton } from 'packages/website/src/app/_common/components/Skeleton/Skeleton';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { usePercentOf } from 'packages/website/src/app/_common/hooks/data/usePercentOf';
import React, { useMemo } from 'react';
import { useRelativeDataProducts } from '../../../../contexts/RelativeDataProductsProvider';
import { useBenchmarkValuePerMsrp } from '../../../../hooks/useBenchmarkValuePerMsrp';
import { usePreferredBenchmark } from '../../../../hooks/usePreferredBenchmark';
import { useProductName } from '../../../../hooks/useProductName';
import { useViewProductPath } from '../../../../hooks/useViewProductPath';

enum ContentTag {
  Rated,
  NotRated,
  BestValue,
}

export const DescriptionContent = compileContentComponent(
  {
    tags: [ContentTag.Rated, ContentTag.BestValue],
    Component: (props) => (
      <p>
        The {props.productName} has the best value for the money for the{' '}
        {props.benchmarkName} benchmark.
      </p>
    ),
  },
  {
    tags: [ContentTag.Rated],
    Component: (props) => (
      <p>
        The {props.productName} has {props.percentOfBestLabel} of the
        performance per dollar compared to the leader for the{' '}
        {props.benchmarkName} benchmark:{' '}
        <a href={props.bestProductUrl}>{props.bestProductName}</a>.
      </p>
    ),
  },
  {
    tags: [ContentTag.NotRated],
    Component: (props) => (
      <p>
        We do not have performance per dollar data for the {props.productName}{' '}
        for the {props.benchmarkName} benchmark.
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
  const bestProduct = relativeDataProducts?.bestBenchmarkPerformancePerDollar;

  const score = useBenchmarkValuePerMsrp(product, preferredBenchmark);
  const bestScore = useBenchmarkValuePerMsrp(bestProduct, preferredBenchmark);

  return useMemo(() => {
    const tags: ContentTag[] = [];

    if (score != null) {
      tags.push(ContentTag.Rated);
    } else {
      tags.push(ContentTag.NotRated);
    }

    if (score === bestScore) {
      tags.push(ContentTag.BestValue);
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
  const bestProduct = relativeDataProducts?.bestBenchmarkPerformancePerDollar;

  const productName = useProductName(product, { company: false });
  const score = useBenchmarkValuePerMsrp(product, preferredBenchmark);
  const bestScore = useBenchmarkValuePerMsrp(bestProduct, preferredBenchmark);
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
