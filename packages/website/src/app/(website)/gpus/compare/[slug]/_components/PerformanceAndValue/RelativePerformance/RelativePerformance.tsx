'use client';

import {
  CompareGpusViewModel,
  getGpuChipset,
  getListGpusPath,
  ListGpusPresetSlug,
  productBenchmarkValue,
  ProductType,
} from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { usePreferredBenchmark } from 'packages/website/src/app/_common/user/usePreferredBenchmark';
import React, { FunctionComponent, useMemo } from 'react';
import { PerformanceIntro } from './PerformanceIntro';
import { PerformanceTable } from './PerformanceTable';

export const RelativePerformance: FunctionComponent = () => {
  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);
  const viewModel = useViewModel<CompareGpusViewModel>();
  const { comparison, relativePerformanceGpus } = viewModel;
  const [gpu1, gpu2] = comparison;

  const chipset1 = getGpuChipset(gpu1);
  const chipset2 = getGpuChipset(gpu2);

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
