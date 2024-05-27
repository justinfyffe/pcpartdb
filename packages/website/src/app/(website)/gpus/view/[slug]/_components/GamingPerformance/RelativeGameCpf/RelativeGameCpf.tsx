'use client';

import { hasProductFieldValue, ViewGpuViewModel } from '@pcpartdb/shared';
import { useViewModelContext } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { classNames } from 'packages/website/src/app/_common/utils/classNames';
import React, { FunctionComponent, useMemo } from 'react';
import { RelativeGameCpfIntro } from './RelativeGameCpfIntro';
import { RelativeGameCpfTable } from './RelativeGameCpfTable';

export const RelativeGameCpf: FunctionComponent = () => {
  const { viewModel } = useViewModelContext<ViewGpuViewModel>();
  const { gpu } = viewModel;

  const hasMsrp = useMemo(() => {
    return hasProductFieldValue(gpu.fields?.msrp);
  }, [gpu.fields?.msrp]);

  return (
    <section className={classNames('flex-1', hasMsrp ? '' : 'md:hidden')}>
      <h3 className="mb-1 font-semibold">Compare Cost Per Frame</h3>
      <RelativeGameCpfIntro />
      <RelativeGameCpfTable />
    </section>
  );
};
