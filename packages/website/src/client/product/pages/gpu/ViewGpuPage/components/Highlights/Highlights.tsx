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
  formatGpuField,
  getGpuAffiliateUrl,
} from '@pcpartdb/shared';
import { ProductHighlight } from 'packages/website/src/client/product/components/ProductHighlight/ProductHighlight';
import { AffiliateDisclaimer } from 'packages/website/src/client/shared/components/AffiliateDisclaimer/AffiliateDisclaimer';
import { WarningButton } from 'packages/website/src/client/shared/components/Button/WarningButton';
import { classNames } from 'packages/website/src/client/shared/ui';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ViewPageContext } from '../../context';

interface HighlightsProps {
  className?: string;
}

export const Highlights: FunctionComponent<HighlightsProps> = (props) => {
  const { className } = props;

  const context = useContext(ViewPageContext);
  const gpu = context.gpu;
  const parent = gpu.chipset;

  const highlightPerformance = useMemo(() => {
    const performanceScore =
      formatGpuField(gpu.performanceScore) ||
      formatGpuField(parent?.performanceScore);

    if (performanceScore != null) {
      return `${performanceScore}`;
    } else {
      return '--';
    }
  }, [gpu.performanceScore, parent?.performanceScore]);

  const highlightValue = useMemo(() => {
    const valueScore =
      formatGpuField(gpu.valueScore) || formatGpuField(parent?.valueScore);

    if (valueScore != null) {
      return `${valueScore}`;
    } else {
      return '--';
    }
  }, [gpu.valueScore, parent?.valueScore]);

  const highlightMemory = useMemo(() => {
    const memorySize = formatGpuField(gpu.memorySize);
    const memoryType = formatGpuField(gpu.memoryType);
    return [memorySize, memoryType].filter((value) => value != null).join(' ');
  }, [gpu]);

  const highlightDimensions = useMemo(() => {
    return formatGpuDimensions(gpu, { allowMissingDimensions: true }) || '--';
  }, [gpu]);

  const highlightTdp = useMemo(() => {
    return formatGpuField(gpu.thermalDesignPower) || '--';
  }, [gpu.thermalDesignPower]);

  const highlightReleaseDate = useMemo(() => {
    return formatGpuField(gpu.releaseDate) || '--';
  }, [gpu.releaseDate]);

  const gpuAffiliateUrl = useMemo(() => getGpuAffiliateUrl(gpu), [gpu]);

  return (
    <div
      className={classNames(
        'grid grid-cols-2 lg:flex flex-col md:gap-3 gap-4',
        className,
      )}
    >
      <ProductHighlight
        icon={<StarIcon />}
        label="Performance"
        value={highlightPerformance}
      />

      <ProductHighlight
        icon={<CircleStackIcon />}
        label="Memory"
        value={highlightMemory}
      />

      <ProductHighlight
        icon={<CurrencyDollarIcon />}
        label="Performance / $ (MSRP)"
        value={highlightValue}
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
              <WarningButton
                href={gpuAffiliateUrl}
                target="_blank"
                rel="noopener nofollow"
              >
                Check Price on Amazon
              </WarningButton>
            }
          />
          {gpuAffiliateUrl && <AffiliateDisclaimer />}
        </div>
      )}
    </div>
  );
};
