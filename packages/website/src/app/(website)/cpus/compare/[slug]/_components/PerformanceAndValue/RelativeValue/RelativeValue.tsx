'use client';

import { getListCpusPath, ListCpusPresetSlug } from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import React, { FunctionComponent, useMemo } from 'react';
import { ValueIntro } from './ValueIntro';
import { ValueTable } from './ValueTable';

export const RelativeValue: FunctionComponent = () => {
  const listHref = useMemo(
    () => getListCpusPath(ListCpusPresetSlug.BestPerformancePerDollar),
    [],
  );

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
