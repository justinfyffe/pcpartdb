'use client';

import {
  formatOrdinalNumber,
  getListCpusPath,
  getListGpusPath,
  getProductBenchmarkName,
  ListCpusPresetSlug,
  ListGpusPresetSlug,
  Product,
  ProductType,
} from '@pcpartdb/shared';
import { Skeleton } from 'packages/website/src/app/_common/components/Skeleton/Skeleton';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { usePercentOf } from 'packages/website/src/app/_common/hooks/data/usePercentOf';
import React, { useMemo } from 'react';
import { useRelativeDataProducts } from '../../../../contexts/RelativeDataProductsProvider';
import { useBenchmarkValue } from '../../../../hooks/useBenchmarkValue';
import { useBenchmarkValueRank } from '../../../../hooks/useBenchmarkValueRank';
import { usePreferredBenchmark } from '../../../../hooks/usePreferredBenchmark';
import { useProductName } from '../../../../hooks/useProductName';
import { useViewProductPath } from '../../../../hooks/useViewProductPath';
import { useScoreLabel } from '../../useScoreLabel';

enum ContentTag {
  Rated,
  NotRated,
  BestPerformance,
  Ranked,
}

const PercentOfBestContent = compileContentComponent(
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
        benchmark: <a href={props.bestProductUrl}>{props.bestProductName}</a>.
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

const RankContent = compileContentComponent({
  tags: [ContentTag.Ranked],
  Component: (props) => (
    <p>
      The{' '}
      <span className="font-medium">
        <a href={props.listUrl}>
          {props.productName} is ranked {props.rankLabel}
        </a>
      </span>{' '}
      with a score of {props.scoreLabel}.
    </p>
  ),
});

interface LongDescriptionProps {
  product: Partial<Product>;
}

export const LongDescription = (props: LongDescriptionProps) => {
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
        <PercentOfBestContent />
        <RankContent />
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
  const rank = useBenchmarkValueRank(product, preferredBenchmark);

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

    if (rank != null) {
      tags.push(ContentTag.Ranked);
    }

    return tags;
  }, [bestScore, rank, score]);
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

  // Percent Of Best Content

  const score = useBenchmarkValue(product, preferredBenchmark);
  const bestScore = useBenchmarkValue(bestProduct, preferredBenchmark);
  const percentOfBest = usePercentOf(score, bestScore);
  const bestProductName = useProductName(bestProduct);
  const bestProductUrl = useViewProductPath(bestProduct);
  const benchmarkName = getProductBenchmarkName(preferredBenchmark);
  const percentOfBestLabel = `${percentOfBest?.toFixed(0)}%`;

  // Rank Content

  let productTypeLabel: string = null;
  if (productType === ProductType.Cpu) {
    productTypeLabel = 'CPUs';
  } else if (productType === ProductType.Gpu) {
    productTypeLabel = 'GPUs';
  }
  const scoreLabel = useScoreLabel({ score, maxDecimals: 2 });
  const rank = useBenchmarkValueRank(product, preferredBenchmark);
  const rankLabel = formatOrdinalNumber(rank);
  let listUrl: string = null; // TODO: make into hook
  if (productType === ProductType.Cpu) {
    listUrl = getListCpusPath(ListCpusPresetSlug.BestPerformance);
  } else if (productType === ProductType.Gpu) {
    listUrl = getListGpusPath(ListGpusPresetSlug.BestPerformance);
  }

  return {
    productName,
    bestProductName,
    bestProductUrl,
    percentOfBestLabel,
    benchmarkName,
    productTypeLabel,
    scoreLabel,
    rankLabel,
    listUrl,
  };
}
