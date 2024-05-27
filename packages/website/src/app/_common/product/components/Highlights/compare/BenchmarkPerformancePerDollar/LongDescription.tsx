'use client';

import {
  formatOrdinalNumber,
  getListCpusPath,
  getListGpusPath,
  getProductBenchmarkName,
  ListCpusPresetSlug,
  ListGpusPresetSlug,
  ProductComparison,
  ProductType,
} from '@pcpartdb/shared';
import { Skeleton } from 'packages/website/src/app/_common/components/Skeleton/Skeleton';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { hasContentTags } from 'packages/website/src/app/_common/content/utils/hasContentTag';
import { usePercentOf } from 'packages/website/src/app/_common/hooks/data/usePercentOf';
import React, { useMemo } from 'react';
import { useRelativeDataProducts } from '../../../../contexts/RelativeDataProductsProvider';
import { useBenchmarkValuePerMsrp } from '../../../../hooks/useBenchmarkValuePerMsrp';
import { useBenchmarkValuePerMsrpRank } from '../../../../hooks/useBenchmarkValuePerMsrpRank';
import { usePreferredBenchmark } from '../../../../hooks/usePreferredBenchmark';
import { useProductName } from '../../../../hooks/useProductName';
import { useViewProductPath } from '../../../../hooks/useViewProductPath';
import { usePercentHigherLabel } from '../../usePercentHigherLabel';
import { useScoreLabel } from '../../useScoreLabel';

enum ContentTag {
  TwoRated,
  OneRated,
  ZeroRated,
  BestValue,
  TwoRanked,
  OneRanked,
}

const ComparisonContent = compileContentComponent(
  {
    tags: [ContentTag.TwoRated],
    Component: (props) => (
      <p>
        The {props.betterProductName} has {props.percentHigherLabel} better
        value for the money than the {props.weakerProductName} for the{' '}
        {props.benchmarkName} benchmark.
      </p>
    ),
  },
  {
    tags: [ContentTag.OneRated, ContentTag.BestValue],
    Component: (props) => (
      <p>
        The {props.onlyRatedProductName} has the best value for the money for
        the {props.benchmarkName} benchmark.
      </p>
    ),
  },
  {
    tags: [ContentTag.OneRated],
    Component: (props) => (
      <p>
        The {props.onlyRatedProductName} has {props.percentOfBestLabel} of the
        performance per dollar compared to the leader for the{' '}
        {props.benchmarkName} benchmark:{' '}
        <a href={props.bestProductUrl} target="_blank">
          {props.bestProductName}
        </a>
        .
      </p>
    ),
  },
  {
    tags: [ContentTag.ZeroRated],
    Component: (props) => (
      <p>
        We do not have any performance per dollar data for the{' '}
        {props.productName1} and the {props.productName2} for the{' '}
        {props.benchmarkName} benchmark.
      </p>
    ),
  },
);

const RankContent = compileContentComponent(
  {
    tags: [ContentTag.TwoRanked],
    Component: (props) => (
      <p>
        The{' '}
        <span className="font-medium">
          <a href={props.listUrl}>
            {props.productName1} is ranked {props.rankLabel1}
          </a>
        </span>{' '}
        with a performance per dollar of {props.scoreLabel1}, and the{' '}
        <span className="font-medium">
          <a href={props.listUrl}>
            {props.productName2} is ranked {props.rankLabel2}
          </a>
        </span>{' '}
        with a performance per dollar of {props.scoreLabel2}.
      </p>
    ),
  },
  {
    tags: [ContentTag.OneRanked],
    Component: (props) => (
      <p>
        {props.onlyRankedProductName}&apos;s {props.scoreLabel} performance per
        dollar ranks it <a href={props.listUrl}>{props.rankLabel}</a> among the
        other benchmarked {props.productTypeLabel} in our database.
      </p>
    ),
  },
);

interface LongDescriptionProps {
  comparison: ProductComparison;
}

export const LongDescription = (props: LongDescriptionProps) => {
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
        <ComparisonContent />
        <RankContent />
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
  const bestProduct = relativeDataProducts?.bestBenchmarkPerformancePerDollar;

  const score1 = useBenchmarkValuePerMsrp(product1, preferredBenchmark);
  const score2 = useBenchmarkValuePerMsrp(product2, preferredBenchmark);
  const bestScore = useBenchmarkValuePerMsrp(bestProduct, preferredBenchmark);
  const rank1 = useBenchmarkValuePerMsrpRank(product1, preferredBenchmark);
  const rank2 = useBenchmarkValuePerMsrpRank(product2, preferredBenchmark);

  return useMemo(() => {
    const tags: ContentTag[] = [];

    if (score1 === bestScore || score2 === bestScore) {
      tags.push(ContentTag.BestValue);
    }

    if (score1 != null && score2 != null) {
      tags.push(ContentTag.TwoRated);
    } else if (score1 != null || score2 != null) {
      tags.push(ContentTag.OneRated);
    } else {
      tags.push(ContentTag.ZeroRated);
    }

    if (rank1 != null && rank2 != null) {
      tags.push(ContentTag.TwoRanked);
    } else if (rank1 != null || rank2 != null) {
      tags.push(ContentTag.OneRanked);
    }

    return tags;
  }, [bestScore, rank1, rank2, score1, score2]);
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
  const bestProduct = relativeDataProducts?.bestBenchmarkPerformance;

  const productName1 = useProductName(product1, { company: false });
  const productName2 = useProductName(product2, { company: false });

  // Comparison Content

  const score1 = useBenchmarkValuePerMsrp(product1, preferredBenchmark);
  const score2 = useBenchmarkValuePerMsrp(product2, preferredBenchmark);
  const bestScore = useBenchmarkValuePerMsrp(bestProduct, preferredBenchmark);
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
  const bestProductName = useProductName(bestProduct);
  const bestProductUrl = useViewProductPath(bestProduct);
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

  // Rank Content

  let productTypeLabel: string = null;
  if (productType === ProductType.Cpu) {
    productTypeLabel = 'CPUs';
  } else if (productType === ProductType.Gpu) {
    productTypeLabel = 'GPUs';
  }
  const scoreLabel1 = useScoreLabel({ score: score1, maxDecimals: 2 });
  const scoreLabel2 = useScoreLabel({ score: score2, maxDecimals: 2 });
  const scoreLabel = scoreLabel1 || scoreLabel2;
  const rank1 = useBenchmarkValuePerMsrpRank(product1, preferredBenchmark);
  const rank2 = useBenchmarkValuePerMsrpRank(product2, preferredBenchmark);
  const rankLabel1 = formatOrdinalNumber(rank1);
  const rankLabel2 = formatOrdinalNumber(rank2);
  const rankLabel = rankLabel1 || rankLabel2;
  let listUrl: string = null; // TODO: make into hook
  if (productType === ProductType.Cpu) {
    listUrl = getListCpusPath(ListCpusPresetSlug.BestPerformancePerDollar);
  } else if (productType === ProductType.Gpu) {
    listUrl = getListGpusPath(ListGpusPresetSlug.BestPerformancePerDollar);
  }

  let onlyRankedProductName: string = null;
  if (hasContentTags(tags, ContentTag.OneRanked) && rank1 != null) {
    onlyRankedProductName = productName1;
  } else if (hasContentTags(tags, ContentTag.OneRanked) && rank2 != null) {
    onlyRankedProductName = productName2;
  }

  return {
    productName1,
    productName2,
    // Comparison Content
    betterProductName,
    weakerProductName,
    onlyRatedProductName,
    bestProductName,
    bestProductUrl,
    percentHigherLabel,
    percentOfBestLabel,
    benchmarkName,
    // Rank Content
    productTypeLabel,
    scoreLabel,
    scoreLabel1,
    scoreLabel2,
    rankLabel,
    rankLabel1,
    rankLabel2,
    onlyRankedProductName,
    listUrl,
  };
}
