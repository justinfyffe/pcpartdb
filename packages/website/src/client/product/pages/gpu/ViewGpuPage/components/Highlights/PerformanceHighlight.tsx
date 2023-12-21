import { StarIcon } from '@heroicons/react/24/outline';
import {
  getGpuChipset,
  getProductBenchmarkName,
  productBenchmarkValue,
  ProductType,
} from '@pcpartdb/shared';
import { ProductHighlight } from 'packages/website/src/client/product/components/ProductHighlight/ProductHighlight';
import {
  Button,
  ButtonVariant,
} from 'packages/website/src/client/shared/components/Button/Button';
import { usePreferredBenchmark } from 'packages/website/src/client/user/hooks/usePreferredBenchmark';
import { usePreferredBenchmarkDialog } from 'packages/website/src/client/user/hooks/usePreferredBenchmarkDialog';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ViewPageContext } from '../../context/ViewPageContextProvider';

interface PerformanceHighlightProps {
  className?: string;
}

export const PerformanceHighlight: FunctionComponent<
  PerformanceHighlightProps
> = (props) => {
  const { className } = props;

  const context = useContext(ViewPageContext);
  const gpu = context.gpu;
  const parent = getGpuChipset(gpu);
  const updateViewModel = context.updateViewModel;
  const bestPerfGpu = context.contentData?.bestPerformanceGpu;

  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);
  const showPreferredBenchmarkDialog = usePreferredBenchmarkDialog({
    productType: ProductType.Gpu,
    softReload: true,
    productIds: [gpu.id],
    onChange: updateViewModel,
  });

  const score = useMemo(
    () =>
      productBenchmarkValue(gpu, preferredBenchmark) ||
      productBenchmarkValue(parent, preferredBenchmark),
    [gpu, parent, preferredBenchmark],
  );

  const valueText = useMemo(() => {
    if (score != null) {
      return `${score.toLocaleString()}`;
    } else {
      return '--';
    }
  }, [score]);

  const diffText = useMemo(() => {
    if (score == null || bestPerfGpu == null) {
      return null;
    }
    const bestScore = productBenchmarkValue(bestPerfGpu, preferredBenchmark);
    if (bestScore === score) {
      return 'Best Performance';
    }

    const pct = ((score / bestScore) * 100).toFixed(0);
    return `${pct}% of ${bestScore.toLocaleString()}`;
  }, [bestPerfGpu, score, preferredBenchmark]);

  return (
    <ProductHighlight
      icon={<StarIcon />}
      label={
        <Button
          variant={ButtonVariant.Link}
          className="text-content flex flex-col"
          onClick={showPreferredBenchmarkDialog}
        >
          <span>Performance</span>
          <span className="text-link text-sm">
            {getProductBenchmarkName(preferredBenchmark)}
          </span>
        </Button>
      }
      value={
        <div className="flex flex-col gap-1 items-end">
          <div className="flex flex-col gap-1 items-center">
            <span>{valueText}</span>
            <span className="text-sm">{diffText}</span>
          </div>
        </div>
      }
      className={className}
    />
  );
};
