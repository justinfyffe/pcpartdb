'use client';

import {
  CompareCpusViewModel,
  getListCpusPath,
  ListCpusPresetSlug,
  productBenchmarkValue,
  ProductType,
} from '@pcpartdb/shared';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import {
  Button,
  ButtonVariant,
} from 'packages/website/src/client/shared/components/Button/Button';
import { usePreferredBenchmark } from 'packages/website/src/client/user/hooks/usePreferredBenchmark';
import React, { FunctionComponent, useMemo } from 'react';
import { PerformanceIntro } from './PerformanceIntro';
import { PerformanceTable } from './PerformanceTable';

export const RelativePerformance: FunctionComponent = () => {
  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);
  const viewModel = useViewModel<CompareCpusViewModel>();
  const { comparison, relativePerformanceCpus } = viewModel;
  const [cpu1, cpu2] = comparison;

  const listHref = useMemo(
    () => getListCpusPath(ListCpusPresetSlug.BestPerformance),
    [],
  );

  if (
    !productBenchmarkValue(cpu1, preferredBenchmark) &&
    !productBenchmarkValue(cpu2, preferredBenchmark)
  ) {
    return <></>;
  }

  if (!relativePerformanceCpus?.length) {
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
