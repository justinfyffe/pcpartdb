import { Img } from '@client/shared/components';
import { classNames } from '@client/shared/ui';
import React, { FunctionComponent } from 'react';
import { SidenavSection, SidenavSectionTitle } from '../sidenav';

interface SidenavPopularComparisonsProps {
  className?: string;
}

interface ComparisonListingProps {}

export const SidenavPopularComparisons: FunctionComponent<
  SidenavPopularComparisonsProps
> = (props) => {
  return (
    <SidenavSection
      className={classNames('flex flex-col gap-3', props.className)}
    >
      <SidenavSectionTitle>Popular GPU Comparisons</SidenavSectionTitle>

      <div className="flex flex-col gap-4">
        <ComparisonListing />
        <ComparisonListing />
        <ComparisonListing />
        <ComparisonListing />
      </div>
    </SidenavSection>
  );
};

const ComparisonListing: FunctionComponent<ComparisonListingProps> = () => {
  return (
    <a
      href="#"
      className="flex items-center gap-3 px-2 py-3 border rounded text-sm"
    >
      <Img
        className="max-h-15 max-w-15 mx-auto"
        src="https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ampere/rtx-3090/geforce-rtx-3090-shop-630-d@2x.png"
      />

      <div className="flex-1">
        NVIDIA GeForce RTX 3080 vs NVIDIA GeForce RTX 3070
      </div>
    </a>
  );
};
