import {
  getGpuChipset,
  getListGpusPath,
  ListGpusPresetSlug,
  productBenchmarkValue,
  ProductType,
} from '@pcpartdb/shared';
import {
  Button,
  ButtonVariant,
} from 'packages/website/src/client/shared/components/Button/Button';
import { usePreferredBenchmark } from 'packages/website/src/client/user/hooks/usePreferredBenchmark';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContextProvider';
import { PerformanceIntro } from './PerformanceIntro';
import { PerformanceTable } from './PerformanceTable';

export const RelativePerformance: FunctionComponent = () => {
  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);
  const { comparison, relativePerformanceGpus } =
    useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  const chipset1 = useMemo(() => getGpuChipset(gpu1), [gpu1]);
  const chipset2 = useMemo(() => getGpuChipset(gpu2), [gpu2]);

  const listHref = useMemo(
    () => getListGpusPath(ListGpusPresetSlug.BestPerformance),
    [],
  );

  if (
    !productBenchmarkValue(chipset1, preferredBenchmark) &&
    !productBenchmarkValue(chipset2, preferredBenchmark)
  ) {
    return <></>;
  }

  if (!relativePerformanceGpus?.length) {
    return <></>;
  }

  return (
    <section className="flex-1">
      <h3 className="mb-1 font-semibold">Relative Performance</h3>
      <PerformanceIntro />
      <PerformanceTable />
      <div className="text-right mt-2">
        <Button href={listHref} variant={ButtonVariant.Link}>
          View all GPUs by performance
        </Button>
      </div>
    </section>
  );
};
