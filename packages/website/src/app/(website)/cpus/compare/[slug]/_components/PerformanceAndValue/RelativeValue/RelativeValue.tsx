'use client';

import {
  CompareCpusViewModel,
  getListCpusPath,
  ListCpusPresetSlug,
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
  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);
  const viewModel = useViewModel<CompareCpusViewModel>();
  const { comparison, relativeValueCpus } = viewModel;
  const [cpu1, cpu2] = comparison;

  const listHref = useMemo(
    () => getListCpusPath(ListCpusPresetSlug.BestPerformancePerDollar),
    [],
  );

  if (
    !productBenchmarkValuePerMsrp(cpu1, preferredBenchmark) &&
    !productBenchmarkValuePerMsrp(cpu2, preferredBenchmark)
  ) {
    return <></>;
  }

  if (!relativeValueCpus?.length) {
    return <></>;
  }

  return (
    <section className="flex-1">
      <h3 className="mb-1 font-semibold">Relative Value For Money</h3>
      <ValueIntro />
      <ValueTable />
      <div className="text-right mt-2">
        <Button href={listHref} variant={ButtonVariant.Link}>
          View all CPUs by performance per dollar
        </Button>
      </div>
    </section>
  );
};
