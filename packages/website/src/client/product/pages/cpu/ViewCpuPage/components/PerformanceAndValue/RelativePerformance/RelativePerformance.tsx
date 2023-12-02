import { hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContext';
import { PerformanceIntro } from './PerformanceIntro';
import { PerformanceTable } from './PerformanceTable';

export const RelativePerformance: FunctionComponent = () => {
  const { cpu, relativePerformanceCpus } = useContext(ViewPageContext);

  if (
    !hasProductFieldValue(cpu.fields?.performanceRating) ||
    !relativePerformanceCpus?.length
  ) {
    return <></>;
  }

  return (
    <section>
      <h3 className="mb-0 font-semibold">Relative Performance</h3>
      <PerformanceIntro />
      <PerformanceTable />
    </section>
  );
};
