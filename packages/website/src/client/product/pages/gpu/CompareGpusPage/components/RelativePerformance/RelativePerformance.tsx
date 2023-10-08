import { getGpuChipset, hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ComparePageContext } from '../../context/ComparePageContext';
import { PerformanceIntro } from './PerformanceIntro';
import { PerformanceTable } from './PerformanceTable';

export const RelativePerformance: FunctionComponent = () => {
  const { comparison, additionalData: contentData } =
    useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;
  const { relativePerformanceGpus } = contentData;

  const chipset1 = useMemo(() => getGpuChipset(gpu1), [gpu1]);
  const chipset2 = useMemo(() => getGpuChipset(gpu2), [gpu2]);

  if (
    !hasProductFieldValue(chipset1.fields?.performanceRating) &&
    !hasProductFieldValue(chipset2.fields?.performanceRating)
  ) {
    return <></>;
  }

  if (!relativePerformanceGpus?.length) {
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
