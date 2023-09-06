import { hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../context/ViewPageContext';
import { GeneralInfoIntro } from './GeneralInfoIntro';
import { GeneralInfoTable } from './GeneralInfoTable';

export const GeneralInfo: FunctionComponent = () => {
  const { cpu } = useContext(ViewPageContext);

  if (
    !hasProductFieldValue(cpu.performanceScore) &&
    !hasProductFieldValue(cpu.valueScore) &&
    !hasProductFieldValue(cpu.company) &&
    !hasProductFieldValue(cpu.marketSegment) &&
    !hasProductFieldValue(cpu.launchPrice) &&
    !hasProductFieldValue(cpu.productionStatus)
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
