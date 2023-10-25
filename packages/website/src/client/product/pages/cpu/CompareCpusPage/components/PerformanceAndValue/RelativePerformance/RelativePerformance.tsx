import { hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContext';
import { PerformanceIntro } from './PerformanceIntro';
import { PerformanceTable } from './PerformanceTable';

export const RelativePerformance: FunctionComponent = () => {
  const { comparison, additionalData: contentData } =
    useContext(ComparePageContext);
  const [cpu1, cpu2] = comparison;
  const { relativePerformanceCpus } = contentData;

  if (
    !hasProductFieldValue(cpu1.fields?.performanceRating) &&
    !hasProductFieldValue(cpu2.fields?.performanceRating)
  ) {
    return <></>;
  }

  if (!relativePerformanceCpus?.length) {
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
