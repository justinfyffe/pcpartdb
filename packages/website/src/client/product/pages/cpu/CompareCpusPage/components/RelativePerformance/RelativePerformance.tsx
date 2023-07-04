import { hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../context';
import { PerformanceIntro } from './PerformanceIntro';
import { PerformanceTable } from './PerformanceTable';

export const RelativePerformance: FunctionComponent = () => {
  const { comparison, contentData } = useContext(ComparePageContext);
  const [cpu1, cpu2] = comparison;
  const { relativePerformanceCpus } = contentData;

  if (
    !hasProductFieldValue(cpu1.performanceScore) &&
    !hasProductFieldValue(cpu2.performanceScore)
  ) {
    return <></>;
  }

  if (!relativePerformanceCpus?.length) {
    return <></>;
  }

  return (
    <section>
      <h2 className="mb-0 font-semibold">Relative Performance</h2>
      <PerformanceIntro />
      <PerformanceTable className="mb-4" />
    </section>
  );
};
