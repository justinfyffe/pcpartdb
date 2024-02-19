'use client';

import {
  getGpuChipset,
  getListGpusPath,
  ListGpusPresetSlug,
  productBenchmarkValuePerMsrp,
  ProductType,
  ViewGpuViewModel,
} from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { usePreferredBenchmark } from 'packages/website/src/app/_common/user/usePreferredBenchmark';
import React, { FunctionComponent, useMemo } from 'react';
import { ValueIntro } from './ValueIntro';
import { ValueTable } from './ValueTable';

export const RelativeValue: FunctionComponent = () => {
  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);
  const viewModel = useViewModel<ViewGpuViewModel>();
  const gpu = viewModel.gpu;
  const chipset = getGpuChipset(gpu);
  const relativeValueGpus = viewModel.relativeValueGpus;

  const listHref = useMemo(
    () => getListGpusPath(ListGpusPresetSlug.BestPerformancePerDollar),
    [],
  );

  if (
    !productBenchmarkValuePerMsrp(chipset, preferredBenchmark) ||
    !relativeValueGpus?.length
  ) {
    return <></>;
  }

  return (
    <section className="flex-1">
      <h3 className="mb-1 font-semibold">Relative Value For Money</h3>
      <ValueIntro />
      <ValueTable />
      <div className="text-right mt-2">
        <Button href={listHref} variant={ButtonVariant.Link}>
          View all GPUs by performance per dollar
        </Button>
      </div>
    </section>
  );
};
