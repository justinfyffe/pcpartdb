'use client';

import { getListGpusPath, ListGpusPresetSlug } from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import React, { FunctionComponent, useMemo } from 'react';
import { BenchmarkValueIntro } from './BenchmarkValueIntro';
import { BenchmarkValueTable } from './BenchmarkValueTable';

export const RelativeBenchmarkValue: FunctionComponent = () => {
  const listHref = useMemo(
    () => getListGpusPath(ListGpusPresetSlug.BestPerformancePerDollar),
    [],
  );

  return (
    <section className="flex-1">
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
