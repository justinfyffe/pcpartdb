'use client';

import {
  CompareGpusViewModel,
  getListGpusPath,
  hasProductFieldValue,
  ListGpusPresetSlug,
} from '@pcpartdb/shared';
import classNames from 'classnames';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { useViewModelContext } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import React, { FunctionComponent, useMemo } from 'react';
import { ValueIntro } from './ValueIntro';
import { ValueTable } from './ValueTable';

export const RelativeValue: FunctionComponent = () => {
  const { viewModel } = useViewModelContext<CompareGpusViewModel>();
  const { comparison } = viewModel;
  const gpu1 = comparison[0];
  const gpu2 = comparison[1];

  const listHref = useMemo(
    () => getListGpusPath(ListGpusPresetSlug.BestPerformancePerDollar),
    [],
  );

  const hasMsrp = useMemo(() => {
    return (
      hasProductFieldValue(gpu1.fields?.msrp) ||
      hasProductFieldValue(gpu2.fields?.msrp)
    );
  }, [gpu1.fields?.msrp, gpu2.fields?.msrp]);

  return (
    <section className={classNames('flex-1', hasMsrp ? '' : 'md:hidden')}>
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
