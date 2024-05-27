'use client';

import { getProductBenchmarkName, ProductComparison } from '@pcpartdb/shared';
import { Skeleton } from 'packages/website/src/app/_common/components/Skeleton/Skeleton';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { hasContentTags } from 'packages/website/src/app/_common/content/utils/hasContentTag';
import { usePercentOf } from 'packages/website/src/app/_common/hooks/data/usePercentOf';
import React, { useMemo } from 'react';
import { useRelativeDataProducts } from '../../../../contexts/RelativeDataProductsProvider';
import { useBenchmarkValue } from '../../../../hooks/useBenchmarkValue';
import { usePreferredBenchmark } from '../../../../hooks/usePreferredBenchmark';
import { useProductName } from '../../../../hooks/useProductName';
import { useViewProductPath } from '../../../../hooks/useViewProductPath';
import { usePercentHigherLabel } from '../../usePercentHigherLabel';

enum ContentTag {
  TwoRated,
  OneRated,
  ZeroRated,
  BestPerformance,
}

const DescriptionContent = compileContentComponent(
  {
    tags: [ContentTag.TwoRated],
    Component: (props) => (
      <p>
        The {props.betterProductName} has {props.percentHigherLabel} better
        performance than the {props.weakerProductName} for the{' '}
        {props.benchmarkName} benchmark.
      </p>
    ),
  },
  {
    tags: [ContentTag.OneRated, ContentTag.BestPerformance],
    Component: (props) => (
      <p>
        The {props.onlyRatedProductName} has the best performance for the{' '}
        {props.benchmarkName} benchmark.
      </p>
    ),
  },
  {
    tags: [ContentTag.OneRated],
    Component: (props) => (
      <p>
        The {props.onlyRatedProductName} has {props.percentOfBestLabel} of the
        performance compared to the leader for the {props.benchmarkName}{' '}
        benchmark: <a href={props.bestProductUrl}>{props.bestProductName}</a>.
      </p>
    ),
  },
  {
    tags: [ContentTag.ZeroRated],
    Component: (props) => (
      <p>
        We do not have any performance data for the {props.productName1} and the{' '}
        {props.productName2} for the {props.benchmarkName} benchmark.
      </p>
    ),
  },
);

interface ShortDescriptionProps {
  comparison: ProductComparison;
}

export const ShortDescription = (props: ShortDescriptionProps) => {
  const tags = useDescriptionTags(props);
  const params = useDescriptionParams({ ...props, tags });
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
  comparison: ProductComparison;
}

function useDescriptionTags(args: UseDescriptionTagsArgs) {
  const { comparison } = args;

  const [product1, product2] = comparison;
  const productType = product1.productType || product2.productType;
  const preferredBenchmark = usePreferredBenchmark(productType);
  const { relativeDataProducts } = useRelativeDataProducts();
  const bestProduct = relativeDataProducts?.bestBenchmarkPerformance;

  const score1 = useBenchmarkValue(product1, preferredBenchmark);
  const score2 = useBenchmarkValue(product2, preferredBenchmark);
  const bestScore = useBenchmarkValue(bestProduct, preferredBenchmark);

  return useMemo(() => {
    const tags: ContentTag[] = [];

    if (score1 != null && score2 != null) {
      tags.push(ContentTag.TwoRated);
    } else if (score1 != null || score2 != null) {
      tags.push(ContentTag.OneRated);
    } else {
      tags.push(ContentTag.ZeroRated);
    }

    if (score1 === bestScore || score2 === bestScore) {
      tags.push(ContentTag.BestPerformance);
    }

    return tags;
  }, [bestScore, score1, score2]);
}

interface UseDescriptionParamsArgs {
  tags: ContentTag[];
  comparison: ProductComparison;
}

function useDescriptionParams(args: UseDescriptionParamsArgs) {
  const { tags, comparison } = args;

  const [product1, product2] = comparison;
  const productType = product1.productType || product2.productType;
  const preferredBenchmark = usePreferredBenchmark(productType);
  const { relativeDataProducts } = useRelativeDataProducts();
  const bestPerfProduct = relativeDataProducts?.bestBenchmarkPerformance;

  const productName1 = useProductName(product1, { company: false });
  const productName2 = useProductName(product2, { company: false });
  const score1 = useBenchmarkValue(product1, preferredBenchmark);
  const score2 = useBenchmarkValue(product2, preferredBenchmark);
  const bestScore = useBenchmarkValue(bestPerfProduct, preferredBenchmark);
  const percentOfBest1 = usePercentOf(score1, bestScore);
  const percentOfBest2 = usePercentOf(score2, bestScore);
  const percentHigher1 = usePercentHigherLabel({
    higher: score1,
    lower: score2,
    maxDecimals: 0,
  });
  const percentHigher2 = usePercentHigherLabel({
    higher: score2,
    lower: score1,
    maxDecimals: 0,
  });
  const bestProductName = useProductName(bestPerfProduct);
  const bestProductUrl = useViewProductPath(bestPerfProduct);
  const benchmarkName = getProductBenchmarkName(preferredBenchmark);

  let betterProductName: string = null;
  let weakerProductName: string = null;
  let onlyRatedProductName: string = null;
  let percentOfBestLabel: string = null;
  let percentHigherLabel: string = null;

  if (hasContentTags(tags, ContentTag.TwoRated)) {
    betterProductName = score1 > score2 ? productName1 : productName2;
    weakerProductName = score1 > score2 ? productName2 : productName1;
    percentHigherLabel = score1 > score2 ? percentHigher1 : percentHigher2;
  }
  if (hasContentTags(tags, ContentTag.OneRated) && score1 != null) {
    onlyRatedProductName = productName1;
    percentOfBestLabel = `${percentOfBest1?.toFixed(0)}%`;
  } else if (hasContentTags(tags, ContentTag.OneRated) && score2 != null) {
    onlyRatedProductName = productName2;
    percentOfBestLabel = `${percentOfBest2?.toFixed(0)}%`;
  }

  return {
    productName1,
    productName2,
    betterProductName,
    weakerProductName,
    onlyRatedProductName,
    bestProductName,
    bestProductUrl,
    percentHigherLabel,
    percentOfBestLabel,
    benchmarkName,
  };
}
