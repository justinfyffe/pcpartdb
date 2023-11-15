import { productFieldRawValue, ProductType, RankKey } from '@pcpartdb/shared';
import { ProductCalculations } from './types';

interface PopulateRanksOptions {
  productType: ProductType;
  calculations: Record<number, ProductCalculations>;
}

export function populateRanks(options: PopulateRanksOptions) {
  const { productType } = options;
  if (productType === ProductType.Cpu) {
    populatePerformanceRatingRanks(options);
    populatePerformanceRatingForMarketSegmentRanks(options);
    populatePerformancePerMsrpRanks(options);
    populatePerformancePerMsrpForMarketSegmentRanks(options);
  } else if (productType === ProductType.Gpu) {
    populatePerformanceRatingRanks(options);
    populatePerformanceRatingForMarketSegmentRanks(options);
    populatePerformancePerMsrpRanks(options);
    populatePerformancePerMsrpForMarketSegmentRanks(options);
    populatePerformanceRatingForArchitectureMarketSegmentRanks(options);
  }
}

function populatePerformanceRatingRanks(options: PopulateRanksOptions) {
  const calculations = Object.values(options.calculations).filter(
    (c) => c.scores?.performanceRating,
  );
  calculations.sort(
    (a, b) => b.scores.performanceRating - a.scores.performanceRating,
  );

  let rank = 0;
  let previousScore = null;
  for (const value of calculations) {
    if (value.scores.performanceRating !== previousScore) {
      rank++;
    }
    previousScore = value.scores.performanceRating;

    value.ranks[RankKey.PerformanceRating] = rank;
  }
}

function populatePerformanceRatingForMarketSegmentRanks(
  options: PopulateRanksOptions,
) {
  const calculations = Object.values(options.calculations).filter(
    (c) => c.scores?.performanceRating,
  );
  calculations.sort(
    (a, b) => b.scores.performanceRating - a.scores.performanceRating,
  );
  const marketSegments = [
    ...new Set(
      calculations
        .map((c) => productFieldRawValue(c.product.fields?.marketSegment))
        .filter((value) => value),
    ),
  ];

  for (const marketSegment of marketSegments) {
    const filtered = calculations.filter(
      (c) =>
        productFieldRawValue(c.product.fields?.marketSegment) === marketSegment,
    );
    let rank = 0;
    let previousScore = null;
    for (const value of filtered) {
      if (value.scores.performanceRating !== previousScore) {
        rank++;
      }
      previousScore = value.scores.performanceRating;

      value.ranks[RankKey.PerformanceRatingForMarketSegment] = rank;
    }
  }
}

function populatePerformanceRatingForArchitectureMarketSegmentRanks(
  options: PopulateRanksOptions,
) {
  const calculations = Object.values(options.calculations).filter(
    (c) => c.scores?.performanceRating,
  );
  calculations.sort(
    (a, b) => b.scores.performanceRating - a.scores.performanceRating,
  );
  const architectures = [
    ...new Set(
      calculations
        .map((c) => productFieldRawValue(c.product.fields?.architecture))
        .filter((value) => value),
    ),
  ];
  const marketSegments = [
    ...new Set(
      calculations
        .map((c) => productFieldRawValue(c.product.fields?.marketSegment))
        .filter((value) => value),
    ),
  ];

  for (const architecture of architectures) {
    for (const marketSegment of marketSegments) {
      const filtered = calculations.filter(
        (c) =>
          productFieldRawValue(c.product.fields?.architecture) ===
            architecture &&
          productFieldRawValue(c.product.fields?.marketSegment) ===
            marketSegment,
      );
      let rank = 0;
      let previousScore = null;
      for (const value of filtered) {
        if (value.scores.performanceRating !== previousScore) {
          rank++;
        }
        previousScore = value.scores.performanceRating;

        value.ranks[RankKey.PerformanceRatingForArchitectureMarketSegment] =
          rank;
      }
    }
  }
}

function populatePerformancePerMsrpRanks(options: PopulateRanksOptions) {
  const filtered = Object.values(options.calculations).filter(
    (c) => c.scores?.performancePerMsrp,
  );
  filtered.sort(
    (a, b) => b.scores.performancePerMsrp - a.scores.performancePerMsrp,
  );

  let rank = 0;
  let previousScore = null;
  for (const value of filtered) {
    if (value.scores.performancePerMsrp !== previousScore) {
      rank++;
    }
    value.ranks[RankKey.PerformancePerMsrp] = rank;
    previousScore = value.scores.performancePerMsrp;
  }
}

function populatePerformancePerMsrpForMarketSegmentRanks(
  options: PopulateRanksOptions,
) {
  const calculations = Object.values(options.calculations).filter(
    (c) => c.scores?.performancePerMsrp,
  );
  calculations.sort(
    (a, b) => b.scores.performancePerMsrp - a.scores.performancePerMsrp,
  );
  const marketSegments = [
    ...new Set(
      calculations
        .map((c) => productFieldRawValue(c.product.fields?.marketSegment))
        .filter((value) => value),
    ),
  ];

  for (const marketSegment of marketSegments) {
    const filtered = calculations.filter(
      (c) =>
        productFieldRawValue(c.product.fields?.marketSegment) === marketSegment,
    );
    let rank = 0;
    let previousScore = null;
    for (const value of filtered) {
      if (value.scores.performancePerMsrp !== previousScore) {
        rank++;
      }
      previousScore = value.scores.performancePerMsrp;

      value.ranks[RankKey.PerformancePerMsrpForMarketSegment] = rank;
    }
  }
}
