'use client';

import { getListGpusPath, ListGpusPresetSlug } from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import React, { FunctionComponent, useMemo } from 'react';
import { BenchmarkPerformanceIntro } from './BenchmarkPerformanceIntro';
import { BenchmarkPerformanceTable } from './BenchmarkPerformanceTable';

export const RelativeBenchmarkPerformance: FunctionComponent = () => {
  const listHref = useMemo(
    () => getListGpusPath(ListGpusPresetSlug.BestPerformance),
    [],
  );

  return (
    <section className="flex-1">
      <h3 className="mb-1 font-semibold">Compare Performance</h3>
      <BenchmarkPerformanceIntro />
      <BenchmarkPerformanceTable />

      <div className="text-right mt-2">
        <Button href={listHref} variant={ButtonVariant.Link}>
          View all GPUs by performance
        </Button>
      </div>
    </section>
  );
};
