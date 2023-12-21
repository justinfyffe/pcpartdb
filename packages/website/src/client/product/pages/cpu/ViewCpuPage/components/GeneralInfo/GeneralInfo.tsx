import { hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../context/ViewPageContextProvider';
import { GeneralInfoIntro } from './GeneralInfoIntro';
import { GeneralInfoTable } from './GeneralInfoTable';

export const GeneralInfo: FunctionComponent = () => {
  const { cpu } = useContext(ViewPageContext);

  if (
    !cpu.company &&
    !hasProductFieldFormattedValue(cpu.fields?.marketSegment) &&
    !hasProductFieldFormattedValue(cpu.fields?.msrp) &&
    !hasProductFieldFormattedValue(cpu.fields?.productionStatus)
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
