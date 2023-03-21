import { getCompareGpusPath, GpuComparison } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { getCompareGpusSlug, getGpuComparisonName } from '../../../gpus';
import { classNames } from '../../../shared/ui';
import { SidenavSection, SidenavSectionTitle } from '../Sidenav';

interface SidenavComparisonsProps {
  comparisons?: GpuComparison[];
  className?: string;
}

export const SidenavComparisons: FunctionComponent<SidenavComparisonsProps> = (
  props,
) => {
  const comparisons = props.comparisons || [];

  if (comparisons.length === 0) {
    return <></>;
  }

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
  comparison: GpuComparison;
}

const ComparisonListing: FunctionComponent<ComparisonListingProps> = (
  props,
) => {
  const { comparison } = props;

  return (
    <a
      href={getCompareGpusPath(getCompareGpusSlug(comparison))}
      className="flex items-center gap-3 px-3 py-3 border-px rounded text-sm"
    >
      <div className="flex-1">{getGpuComparisonName(comparison)}</div>
    </a>
  );
};
