import { hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../context/ViewPageContext';
import { GeneralInfoIntro } from './GeneralInfoIntro';
import { GeneralInfoTable } from './GeneralInfoTable';

export const GeneralInfo: FunctionComponent = () => {
  const { gpu } = useContext(ViewPageContext);

  if (
    !hasProductFieldValue(gpu.performanceScore) &&
    !hasProductFieldValue(gpu.valueScore) &&
    !hasProductFieldValue(gpu.company) &&
    !hasProductFieldValue(gpu.architecture) &&
    !hasProductFieldValue(gpu.marketSegment) &&
    !hasProductFieldValue(gpu.launchPrice) &&
    !hasProductFieldValue(gpu.productionStatus)
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
