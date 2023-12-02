import { hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../context/ComparePageContext';
import { GeneralInfoIntro } from './GeneralInfoIntro';
import { GeneralInfoTable } from './GeneralInfoTable';

export const GeneralInfo: FunctionComponent = () => {
  const { comparison } = useContext(ComparePageContext);
  const [cpu1, cpu2] = comparison;

  if (
    !hasProductFieldFormattedValue(cpu1.fields?.performanceRating) &&
    !hasProductFieldFormattedValue(cpu2.fields?.performanceRating) &&
    !hasProductFieldFormattedValue(cpu1.fields?.performancePerMsrp) &&
    !hasProductFieldFormattedValue(cpu2.fields?.performancePerMsrp) &&
    !cpu1.company &&
    !cpu2.company &&
    !hasProductFieldFormattedValue(cpu1.fields?.marketSegment) &&
    !hasProductFieldFormattedValue(cpu2.fields?.marketSegment) &&
    !hasProductFieldFormattedValue(cpu1.fields?.msrp) &&
    !hasProductFieldFormattedValue(cpu2.fields?.msrp) &&
    !hasProductFieldFormattedValue(cpu1.fields?.productionStatus) &&
    !hasProductFieldFormattedValue(cpu2.fields?.productionStatus)
  ) {
    return <></>;
  }

  return (
    <section>
      <h2 className="mb-1 font-semibold">General Info</h2>
      <GeneralInfoIntro />
      <GeneralInfoTable />
    </section>
  );
};
