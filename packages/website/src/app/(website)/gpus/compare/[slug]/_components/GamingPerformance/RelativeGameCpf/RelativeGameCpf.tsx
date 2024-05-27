'use client';

import { CompareGpusViewModel, hasProductFieldValue } from '@pcpartdb/shared';
import { useViewModelContext } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { classNames } from 'packages/website/src/app/_common/utils/classNames';
import React, { FunctionComponent, useMemo } from 'react';
import { RelativeGameCpfIntro } from './RelativeGameCpfIntro';
import { RelativeGameCpfTable } from './RelativeGameCpfTable';

export const RelativeGameCpf: FunctionComponent = () => {
  const { viewModel } = useViewModelContext<CompareGpusViewModel>();
  const { comparison } = viewModel;
  const gpu1 = comparison[0];
  const gpu2 = comparison[1];

  const hasMsrp = useMemo(() => {
    return (
      hasProductFieldValue(gpu1.fields?.msrp) ||
      hasProductFieldValue(gpu2.fields?.msrp)
    );
  }, [gpu1.fields?.msrp, gpu2.fields?.msrp]);

  return (
    <section className={classNames('flex-1', hasMsrp ? '' : 'md:hidden')}>
      <h3 className="mb-1 font-semibold">Compare Cost Per Frame</h3>
      <RelativeGameCpfIntro />
      <RelativeGameCpfTable />
    </section>
  );
};
