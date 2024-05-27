'use client';

import {
  getListGpusPath,
  hasProductFieldValue,
  ListGpusPresetSlug,
  ViewGpuViewModel,
} from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { useViewModelContext } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { classNames } from 'packages/website/src/app/_common/utils/classNames';
import React, { FunctionComponent, useMemo } from 'react';
import { BenchmarkValueIntro } from './BenchmarkValueIntro';
import { BenchmarkValueTable } from './BenchmarkValueTable';

export const RelativeBenchmarkValue: FunctionComponent = () => {
  const { viewModel } = useViewModelContext<ViewGpuViewModel>();
  const { gpu } = viewModel;

  const listHref = useMemo(
    () => getListGpusPath(ListGpusPresetSlug.BestPerformancePerDollar),
    [],
  );

  const hasMsrp = useMemo(() => {
    return hasProductFieldValue(gpu.fields?.msrp);
  }, [gpu.fields?.msrp]);

  return (
    <section className={classNames('flex-1', hasMsrp ? '' : 'md:hidden')}>
      <h3 className="mb-1 font-semibold">Compare Value For Money</h3>
      <BenchmarkValueIntro />
      <BenchmarkValueTable />

      <div className="text-right mt-2">
        <Button href={listHref} variant={ButtonVariant.Link}>
          View all GPUs by performance per dollar
        </Button>
      </div>
    </section>
  );
};
