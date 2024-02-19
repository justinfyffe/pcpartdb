'use client';

import {
  getListCpusPath,
  ListCpusPresetSlug,
  productBenchmarkValue,
  ProductType,
  ViewCpuViewModel,
} from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { usePreferredBenchmark } from 'packages/website/src/app/_common/user/usePreferredBenchmark';
import React, { FunctionComponent, useMemo } from 'react';
import { PerformanceIntro } from './PerformanceIntro';
import { PerformanceTable } from './PerformanceTable';

export const RelativePerformance: FunctionComponent = () => {
  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);
  const viewModel = useViewModel<ViewCpuViewModel>();
  const cpu = viewModel.cpu;
  const relativePerformanceCpus = viewModel.relativePerformanceCpus;

  const listHref = useMemo(
    () => getListCpusPath(ListCpusPresetSlug.BestPerformance),
    [],
  );

  if (
    !productBenchmarkValue(cpu, preferredBenchmark) ||
    !relativePerformanceCpus?.length
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
          View all CPUs by performance
        </Button>
      </div>
    </section>
  );
};
