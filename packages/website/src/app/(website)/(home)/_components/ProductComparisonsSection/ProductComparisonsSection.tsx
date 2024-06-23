import { ProductType } from '@pcpartdb/shared';
import React from 'react';
import { ProductComparisonCard } from './ProductComparisonCard';
import { ProductComparisonCardTag } from './types';

interface ProductComparisonsSectionProps {
  productType: ProductType;
  title: string | React.ReactNode | React.ReactNode[];
}

export function ProductComparisonsSection(
  props: ProductComparisonsSectionProps,
) {
  const { productType, title } = props;
  return (
    <section>
      <h2>{title}</h2>
      <div className="flex flex-col justify-center -mx-4">
        <ProductComparisonCard
          productType={productType}
          tag={ProductComparisonCardTag.ComparePerformance}
        />

        <ProductComparisonCard
          productType={productType}
          tag={ProductComparisonCardTag.CompareValue}
        />
      </div>
    </section>
  );
}
