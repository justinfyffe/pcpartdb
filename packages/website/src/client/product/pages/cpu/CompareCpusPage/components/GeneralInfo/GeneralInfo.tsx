import { hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../context';
import { GeneralInfoIntro } from './GeneralInfoIntro';
import { GeneralInfoTable } from './GeneralInfoTable';

export const GeneralInfo: FunctionComponent = () => {
  const { comparison } = useContext(ComparePageContext);
  const [cpu1, cpu2] = comparison;

  if (
    !hasProductFieldValue(cpu1.performanceScore) &&
    !hasProductFieldValue(cpu2.performanceScore) &&
    !hasProductFieldValue(cpu1.valueScore) &&
    !hasProductFieldValue(cpu2.valueScore) &&
    !hasProductFieldValue(cpu1.company) &&
    !hasProductFieldValue(cpu2.company) &&
    !hasProductFieldValue(cpu1.marketSegments) &&
    !hasProductFieldValue(cpu2.marketSegments) &&
    !hasProductFieldValue(cpu1.launchPrice) &&
    !hasProductFieldValue(cpu2.launchPrice) &&
    !hasProductFieldValue(cpu1.productionStatus) &&
    !hasProductFieldValue(cpu2.productionStatus)
  ) {
    return <></>;
  }

  return (
    <section>
      <h2 className="mb-0 font-semibold">General Info</h2>
      <GeneralInfoIntro />
      <GeneralInfoTable className="mb-4" />
    </section>
  );
};
