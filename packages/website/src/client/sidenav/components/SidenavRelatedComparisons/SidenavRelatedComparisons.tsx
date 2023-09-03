import {
  formatProductComparisonName,
  getCompareProductsPath,
  ProductComparison,
  ProductType,
} from '@pcpartdb/shared';
import React, { FunctionComponent, useMemo } from 'react';
import { classNames } from '../../../shared/ui';
import { SidenavSection, SidenavSectionTitle } from '../Sidenav';

interface SidenavRelatedComparisonsProps {
  productType: ProductType;
  comparisons?: ProductComparison[];
  className?: string;
}

export const SidenavRelatedComparisons: FunctionComponent<
  SidenavRelatedComparisonsProps
> = (props) => {
  const { productType } = props;
  const comparisons = props.comparisons || [];

  const title = useMemo(() => {
    if (productType === ProductType.Cpu) {
      return 'Related CPU Comparisons';
    } else if (productType === ProductType.Gpu) {
      return 'Related GPU Comparisons';
    } else {
      return 'Related Comparisons';
    }
  }, [productType]);

  if (comparisons.length === 0) {
    return <></>;
  }

  return (
    <SidenavSection
      className={classNames('flex flex-col gap-3', props.className)}
    >
      <SidenavSectionTitle>{title}</SidenavSectionTitle>

      <div className="flex flex-col gap-4">
        {comparisons.map((comparison, i) => (
          <ComparisonListing
            key={i}
            productType={productType}
            comparison={comparison}
          />
        ))}
      </div>
    </SidenavSection>
  );
};

interface ComparisonListingProps {
  productType: ProductType;
  comparison: ProductComparison;
}

const ComparisonListing: FunctionComponent<ComparisonListingProps> = (
  props,
) => {
  const { productType, comparison } = props;

  return (
    <a
      href={getCompareProductsPath(productType, comparison)}
      className="flex items-center gap-3 px-3 py-3 border-px rounded"
    >
      <div className="flex-1">
        {formatProductComparisonName(productType, comparison)}
      </div>
    </a>
  );
};
