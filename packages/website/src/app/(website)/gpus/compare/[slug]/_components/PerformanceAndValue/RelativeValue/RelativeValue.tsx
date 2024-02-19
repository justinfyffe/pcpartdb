'use client';

import {
  CompareGpusViewModel,
  getGpuChipset,
  getListGpusPath,
  ListGpusPresetSlug,
  productBenchmarkValuePerMsrp,
  ProductType,
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
  const viewModel = useViewModel<CompareGpusViewModel>();
  const { comparison, relativeValueGpus } = viewModel;
  const [gpu1, gpu2] = comparison;

  const chipset1 = useMemo(() => getGpuChipset(gpu1), [gpu1]);
  const chipset2 = useMemo(() => getGpuChipset(gpu2), [gpu2]);

  const listHref = useMemo(
    () => getListGpusPath(ListGpusPresetSlug.BestPerformancePerDollar),
    [],
  );

  if (
    !productBenchmarkValuePerMsrp(chipset1, preferredBenchmark) &&
    !productBenchmarkValuePerMsrp(chipset2, preferredBenchmark)
  ) {
    return <></>;
  }

  if (!relativeValueGpus?.length) {
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
