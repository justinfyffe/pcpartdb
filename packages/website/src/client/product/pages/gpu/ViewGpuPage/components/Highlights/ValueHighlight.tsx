import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import {
  getGpuChipset,
  getProductBenchmarkName,
  productBenchmarkValuePerMsrp,
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

interface ValueHighlightProps {
  className?: string;
}

export const ValueHighlight: FunctionComponent<ValueHighlightProps> = (
  props,
) => {
  const { className } = props;

  const context = useContext(ViewPageContext);
  const gpu = context.gpu;
  const parent = getGpuChipset(gpu);
  const updateViewModel = context.updateViewModel;
  const bestValueGpu = context.contentData?.bestValueGpu;

  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);
  const showPreferredBenchmarkDialog = usePreferredBenchmarkDialog({
    productType: ProductType.Gpu,
    softReload: true,
    productIds: [gpu.id],
    onChange: updateViewModel,
  });

  const valueScore = useMemo(
    () =>
      productBenchmarkValuePerMsrp(gpu, preferredBenchmark) ||
      productBenchmarkValuePerMsrp(parent, preferredBenchmark),
    [gpu, parent, preferredBenchmark],
  );

  const highlightValue = useMemo(() => {
    if (valueScore != null) {
      return `${valueScore.toLocaleString('en-US', {
        maximumFractionDigits: 2,
      })}`;
    } else {
      return '--';
    }
  }, [valueScore]);

  const valueDiff = useMemo(() => {
    if (valueScore == null || bestValueGpu == null) {
      return null;
    }
    const bestScore = productBenchmarkValuePerMsrp(
      bestValueGpu,
      preferredBenchmark,
    );
    if (bestScore === valueScore) {
      return 'Best Value';
    }

    const pct = ((valueScore / bestScore) * 100).toFixed(0);
    return `${pct}% of ${bestScore.toLocaleString('en-US', {
      maximumFractionDigits: 2,
    })}`;
  }, [valueScore, bestValueGpu, preferredBenchmark]);

  return (
    <ProductHighlight
      icon={<CurrencyDollarIcon />}
      label={
        <Button
          variant={ButtonVariant.Link}
          className="text-content flex flex-col"
          onClick={showPreferredBenchmarkDialog}
        >
          <span>Performance Per Dollar</span>
          <span className="text-link text-sm">
            {getProductBenchmarkName(preferredBenchmark)}
          </span>
        </Button>
      }
      value={
        <div className="flex flex-col gap-1 items-end">
          <div className="flex flex-col gap-1 items-center">
            <span>{highlightValue}</span>
            <span className="text-sm">{valueDiff}</span>
          </div>
        </div>
      }
      className={className}
    />
  );
};
