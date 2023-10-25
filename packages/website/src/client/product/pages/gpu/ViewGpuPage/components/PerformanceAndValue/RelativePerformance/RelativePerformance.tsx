import { hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContext';
import { PerformanceIntro } from './PerformanceIntro';
import { PerformanceTable } from './PerformanceTable';

export const RelativePerformance: FunctionComponent = () => {
  const { gpu, additionalData: contentData } = useContext(ViewPageContext);
  const { relativePerformanceGpus } = contentData;

  if (
    !hasProductFieldValue(gpu.fields?.performanceRating) ||
    !relativePerformanceGpus?.length
  ) {
    return <></>;
  }

  return (
    <section>
      <h3 className="mb-0 font-semibold">Relative Performance</h3>
      <PerformanceIntro />

      <section className="flex flex-wrap gap-8">
        <PerformanceTable />
      </section>
    </section>
  );
};
