'use client';

import {
  getGpuChipset,
  getListGpusPath,
  ListGpusPresetSlug,
  productBenchmarkValue,
  ProductType,
  ViewGpuViewModel,
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
  const viewModel = useViewModel<ViewGpuViewModel>();
  const gpu = viewModel.gpu;
  const chipset = getGpuChipset(gpu);
  const relativePerformanceGpus = viewModel.relativePerformanceGpus;

  const listHref = useMemo(
    () => getListGpusPath(ListGpusPresetSlug.BestPerformance),
    [],
  );

  if (
    !productBenchmarkValue(chipset, preferredBenchmark) ||
    !relativePerformanceGpus?.length
  ) {
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
