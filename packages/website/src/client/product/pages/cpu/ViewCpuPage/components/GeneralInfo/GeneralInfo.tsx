import { hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../context/ViewPageContext';
import { GeneralInfoIntro } from './GeneralInfoIntro';
import { GeneralInfoTable } from './GeneralInfoTable';

export const GeneralInfo: FunctionComponent = () => {
  const { cpu } = useContext(ViewPageContext);

  if (
    !hasProductFieldFormattedValue(cpu.fields?.performanceRating) &&
    !hasProductFieldFormattedValue(cpu.fields?.performancePerMsrp) &&
    !cpu.company &&
    !hasProductFieldFormattedValue(cpu.fields?.marketSegment) &&
    !hasProductFieldFormattedValue(cpu.fields?.msrp) &&
    !hasProductFieldFormattedValue(cpu.fields?.productionStatus)
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
