import {
  BoltIcon,
  CalendarDaysIcon,
  CircleStackIcon,
  CubeTransparentIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import {
  formatGpuDimensions,
  getGpuAffiliateUrl,
  getGpuChipset,
  productFieldFormattedValue,
} from '@pcpartdb/shared';
import { ProductHighlight } from 'packages/website/src/client/product/components/ProductHighlight/ProductHighlight';
import { AffiliateDisclaimer } from 'packages/website/src/client/shared/components/AffiliateDisclaimer/AffiliateDisclaimer';
import { AmazonButton } from 'packages/website/src/client/shared/components/Button/AmazonButton';
import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ViewPageContext } from '../../context/ViewPageContext';

interface HighlightsProps {
  className?: string;
}

export const Highlights: FunctionComponent<HighlightsProps> = (props) => {
  const { className } = props;

  const context = useContext(ViewPageContext);
  const gpu = context.gpu;
  const parent = getGpuChipset(gpu);

  const highlightPerformance = useMemo(() => {
    const performanceScore =
      productFieldFormattedValue(gpu.fields?.performanceRating) ||
      productFieldFormattedValue(parent.fields?.performanceRating);

    if (performanceScore != null) {
      return `${performanceScore}`;
    } else {
      return '--';
    }
  }, [gpu.fields?.performanceRating, parent.fields?.performanceRating]);

  const highlightValue = useMemo(() => {
    const valueScore =
      productFieldFormattedValue(gpu.fields?.performancePerMsrp) ||
      productFieldFormattedValue(parent?.fields?.performancePerMsrp);

    if (valueScore != null) {
      return `${valueScore}`;
    } else {
      return '--';
    }
  }, [gpu.fields?.performancePerMsrp, parent?.fields?.performancePerMsrp]);

  const highlightMemory = useMemo(() => {
    const memorySet = new Set([
      productFieldFormattedValue(gpu.fields?.memorySize),
      productFieldFormattedValue(gpu.fields?.memoryType),
    ]);
    return [...memorySet.values()].filter((value) => value != null).join(' ');
  }, [gpu]);

  const highlightDimensions = useMemo(() => {
    return formatGpuDimensions(gpu, { allowMissingDimensions: true }) ?? '--';
  }, [gpu]);

  const highlightTdp = useMemo(() => {
    return productFieldFormattedValue(gpu.fields?.tdp) ?? '--';
  }, [gpu.fields?.tdp]);

  const highlightReleaseDate = useMemo(() => {
    return productFieldFormattedValue(gpu.fields?.releaseDate) ?? '--';
  }, [gpu.fields?.releaseDate]);

  const gpuAffiliateUrl = useMemo(() => getGpuAffiliateUrl(gpu), [gpu]);

  return (
    <div
      className={classNames(
        'grid grid-cols-2 lg:flex flex-col md:gap-3 gap-4 mb-4',
        className,
      )}
    >
      <ProductHighlight
        icon={<StarIcon />}
        label="Performance Rating"
        value={highlightPerformance}
      />

      <ProductHighlight
        icon={<CurrencyDollarIcon />}
        label="Value Rating"
        value={highlightValue}
      />

      <ProductHighlight
        icon={<CircleStackIcon />}
        label="Memory"
        value={highlightMemory}
      />

      <ProductHighlight
        icon={<CubeTransparentIcon />}
        label="Dimensions"
        value={highlightDimensions}
      />

      <ProductHighlight icon={<BoltIcon />} label="TDP" value={highlightTdp} />

      <ProductHighlight
        icon={<CalendarDaysIcon />}
        label="Release Date"
        value={highlightReleaseDate}
      />

      {gpuAffiliateUrl && (
        <div className="flex flex-col">
          <ProductHighlight
            icon={<ShoppingCartIcon />}
            label="Shop"
            value={
              <AmazonButton
                href={gpuAffiliateUrl}
                target="_blank"
                rel="noopener nofollow"
              >
                Check Price on Amazon
              </AmazonButton>
            }
            className="flex-none"
          />
          {gpuAffiliateUrl && <AffiliateDisclaimer />}
        </div>
      )}
    </div>
  );
};
