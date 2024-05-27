'use client';

import {
  getListCpusPath,
  hasProductFieldValue,
  ListCpusPresetSlug,
  ViewCpuViewModel,
} from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { useViewModelContext } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { classNames } from 'packages/website/src/app/_common/utils/classNames';
import React, { FunctionComponent, useMemo } from 'react';
import { ValueIntro } from './ValueIntro';
import { ValueTable } from './ValueTable';

export const RelativeValue: FunctionComponent = () => {
  const { viewModel } = useViewModelContext<ViewCpuViewModel>();
  const { cpu } = viewModel;

  const listHref = useMemo(
    () => getListCpusPath(ListCpusPresetSlug.BestPerformancePerDollar),
    [],
  );

  const hasMsrp = useMemo(() => {
    return hasProductFieldValue(cpu.fields?.msrp);
  }, [cpu.fields?.msrp]);

  return (
    <section className={classNames('flex-1', hasMsrp ? '' : 'md:hidden')}>
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
