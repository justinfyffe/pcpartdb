import { StarIcon } from '@heroicons/react/24/outline';
import {
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
  const cpu = context.cpu;
  const updateViewModel = context.updateViewModel;
  const bestPerfCpu = context.contentData?.bestPerformanceCpu;

  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);
  const showPreferredBenchmarkDialog = usePreferredBenchmarkDialog({
    productType: ProductType.Cpu,
    softReload: true,
    productIds: [cpu.id],
    onChange: updateViewModel,
  });

  const score = useMemo(
    () => productBenchmarkValue(cpu, preferredBenchmark),
    [cpu, preferredBenchmark],
  );

  const valueText = useMemo(() => {
    if (score != null) {
      return `${score.toLocaleString()}`;
    } else {
      return '--';
    }
  }, [score]);

  const diffText = useMemo(() => {
    if (score == null || bestPerfCpu == null) {
      return null;
    }
    const bestScore = productBenchmarkValue(bestPerfCpu, preferredBenchmark);
    if (bestScore === score) {
      return 'Best Performance';
    }

    const pct = ((score / bestScore) * 100).toFixed(0);
    return `${pct}% of ${bestScore.toLocaleString()}`;
  }, [bestPerfCpu, score, preferredBenchmark]);

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
          <span className="text-link text-sm flex gap-2 items-baseline">
            {getProductBenchmarkName(preferredBenchmark)}
            <span className="text-xs">(change)</span>
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
