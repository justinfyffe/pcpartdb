import React, { FunctionComponent } from 'react';
import { Image } from '../shared/components/image';
import { classNames } from '../shared/ui/ui.utils';
import { SidenavSection, SidenavSectionTitle } from './sidenav';

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
      <SidenavSectionTitle>Popular Comparisons</SidenavSectionTitle>

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
      <Image
        className="max-h-[60px] max-w-[60px] mx-auto"
        src="https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ampere/rtx-3090/geforce-rtx-3090-shop-630-d@2x.png"
      />

      <div className="flex-1">
        NVIDIA GeForce RTX 3080 vs NVIDIA GeForce RTX 3070
      </div>
    </a>
  );
};
