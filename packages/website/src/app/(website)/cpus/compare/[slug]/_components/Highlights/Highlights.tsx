import { CpuProductComparison } from '@pcpartdb/shared';
import { AffiliateDisclaimer } from 'packages/website/src/app/_common/components/AffiliateDisclaimer/AffiliateDisclaimer';
import { BenchmarkPerformanceHighlight } from 'packages/website/src/app/_common/product/components/Highlights/compare/BenchmarkPerformance/BenchmarkPerformanceHighlight';
import { BenchmarkPerformancePerDollarHighlight } from 'packages/website/src/app/_common/product/components/Highlights/compare/BenchmarkPerformancePerDollar/BenchmarkPerformancePerDollarHighlight';
import { HighlightsGrid } from 'packages/website/src/app/_common/product/components/Highlights/compare/HighlightsGrid';
import { ShopHighlight } from 'packages/website/src/app/_common/product/components/Highlights/compare/ShopHighlight';
import React, { FunctionComponent } from 'react';

interface HighlightsProps {
  comparison: CpuProductComparison;
  className?: string;
}

export const Highlights: FunctionComponent<HighlightsProps> = (props) => {
  const { comparison, className } = props;

  return (
    <div className="flex flex-col">
      <HighlightsGrid className={className}>
        <BenchmarkPerformanceHighlight
          comparison={comparison}
          shortDescription
        />
        <BenchmarkPerformancePerDollarHighlight
          comparison={comparison}
          shortDescription
        />
        <ShopHighlight product={comparison[0]} />
        <ShopHighlight product={comparison[1]} />
      </HighlightsGrid>
      <AffiliateDisclaimer className="text-xs" />
    </div>
  );
};
