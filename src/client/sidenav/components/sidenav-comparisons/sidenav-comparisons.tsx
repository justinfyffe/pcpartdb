import { classNames } from '@client/shared/ui';
import {
  getProductComparisonName,
  getProductComparisonPath,
  ProductComparison,
} from '@shared/product';
import React, { FunctionComponent } from 'react';
import { SidenavSection, SidenavSectionTitle } from '../sidenav';

interface SidenavComparisonsProps {
  comparisons?: ProductComparison[];
  className?: string;
}

export const SidenavComparisons: FunctionComponent<SidenavComparisonsProps> = (
  props,
) => {
  const comparisons = props.comparisons || [];

  return (
    <SidenavSection
      className={classNames('flex flex-col gap-3', props.className)}
    >
      <SidenavSectionTitle>Related Comparisons</SidenavSectionTitle>

      <div className="flex flex-col gap-4">
        {comparisons.map((comparison, i) => (
          <ComparisonListing key={i} comparison={comparison} />
        ))}
      </div>
    </SidenavSection>
  );
};

interface ComparisonListingProps {
  comparison: ProductComparison;
}

const ComparisonListing: FunctionComponent<ComparisonListingProps> = (
  props,
) => {
  const { comparison } = props;

  return (
    <a
      href={getProductComparisonPath(comparison)}
      className="flex items-center gap-3 px-3 py-3 border-px rounded text-sm"
    >
      <div className="flex-1">{getProductComparisonName(comparison)}</div>
    </a>
  );
};
