import { CpuProduct } from '@pcpartdb/shared';
import { AffiliateDisclaimer } from 'packages/website/src/app/_common/components/AffiliateDisclaimer/AffiliateDisclaimer';
import { BenchmarkPerformanceHighlight } from 'packages/website/src/app/_common/product/components/Highlights/view/BenchmarkPerformance/BenchmarkPerformanceHighlight';
import { BenchmarkPerformancePerDollarHighlight } from 'packages/website/src/app/_common/product/components/Highlights/view/BenchmarkPerformancePerDollar/BenchmarkPerformancePerDollarHighlight';
import { HighlightsGrid } from 'packages/website/src/app/_common/product/components/Highlights/view/HighlightsGrid';
import { ShopHighlight } from 'packages/website/src/app/_common/product/components/Highlights/view/ShopHighlight';
import { SpecsHighlight } from 'packages/website/src/app/_common/product/components/Highlights/view/SpecsHighlight';
import React, { FunctionComponent } from 'react';

interface HighlightsProps {
  cpu: CpuProduct;
  className?: string;
}

export const Highlights: FunctionComponent<HighlightsProps> = (props) => {
  const { cpu, className } = props;

  return (
    <div className="flex flex-col">
      <HighlightsGrid className={className}>
        <BenchmarkPerformanceHighlight product={cpu} shortDescription />
        <BenchmarkPerformancePerDollarHighlight
          product={cpu}
          shortDescription
        />
        <SpecsHighlight product={cpu} />
        <ShopHighlight product={cpu} disclaimer />
      </HighlightsGrid>
      <AffiliateDisclaimer className="text-xs" />
    </div>
  );
};
