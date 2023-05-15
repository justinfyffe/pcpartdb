import { getChipset } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../context';
import { PerformanceIntro } from './PerformanceIntro';
import { PerformanceTable } from './PerformanceTable';

export const RelativePerformance: FunctionComponent = () => {
  const { comparison } = useContext(ComparePageContext);
  const chipset1 = getChipset(comparison[0]);
  const chipset2 = getChipset(comparison[1]);

  if (
    chipset1.performanceScore?.value == null &&
    chipset2.performanceScore?.value == null
  ) {
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
