'use client';

import { getListCpusPath, ListCpusPresetSlug } from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import React, { FunctionComponent, useMemo } from 'react';
import { PerformanceIntro } from './PerformanceIntro';
import { PerformanceTable } from './PerformanceTable';

export const RelativePerformance: FunctionComponent = () => {
  const listHref = useMemo(
    () => getListCpusPath(ListCpusPresetSlug.BestPerformance),
    [],
  );

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
