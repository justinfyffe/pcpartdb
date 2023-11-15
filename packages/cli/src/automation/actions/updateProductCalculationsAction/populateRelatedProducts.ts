import {
  productFieldRawValue,
  RelatedProductType,
  surroundingValues,
} from '@pcpartdb/shared';
import { ProductCalculations } from './types';

const TOTAL_RELATIVE_PRODUCTS = 10;

interface PopulateRelatedProductsOptions {
  type: RelatedProductType;
  calculations: Record<number, ProductCalculations>;
}

export function populateRelatedProducts(
  options: PopulateRelatedProductsOptions,
) {
  const type = options.type;
  const allCalculations = Object.values(options.calculations);
  const calculations = sortCalculations(type, allCalculations);

  const marketSegments = getMarketSegments(calculations);
  for (const segment of marketSegments) {
    const filtered = calculations.filter(
      (c) => productFieldRawValue(c.product.fields?.marketSegment) === segment,
    );

    for (const calculation of filtered) {
      calculation.related[type] = getSurroundingProducts(
        calculation.product.id,
        filtered,
      ).map((c) => c.product.id);
    }
  }
}

function sortCalculations(
  type: RelatedProductType,
  calculations: ProductCalculations[],
) {
  if (type === RelatedProductType.PerformanceRating) {
    return calculations.sort(
      (a, b) =>
        (b.scores?.performanceRating ?? -1) -
        (a.scores?.performanceRating ?? -1),
    );
  } else if (type === RelatedProductType.PerformancePerMsrp) {
    return calculations.sort(
      (a, b) =>
        (b.scores?.performancePerMsrp ?? -1) -
        (a.scores?.performancePerMsrp ?? -1),
    );
  } else {
    throw new Error(`Invalid related product type: ${type}`);
  }
}

function getSurroundingProducts(
  productId: number,
  calculations: ProductCalculations[],
) {
  const idx = calculations.findIndex((c) => c.product.id === productId);
  if (idx === -1) {
    return [];
  }

  return surroundingValues(calculations, idx, TOTAL_RELATIVE_PRODUCTS);
}

function getMarketSegments(calculations: ProductCalculations[]) {
  return [
    ...new Set(
      calculations
        .map((c) => productFieldRawValue(c.product.fields?.marketSegment))
        .filter((value) => value),
    ),
  ];
}
