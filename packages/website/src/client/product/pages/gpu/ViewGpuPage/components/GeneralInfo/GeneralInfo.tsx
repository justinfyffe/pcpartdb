import { hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../context/ViewPageContextProvider';
import { GeneralInfoIntro } from './GeneralInfoIntro';
import { GeneralInfoTable } from './GeneralInfoTable';

export const GeneralInfo: FunctionComponent = () => {
  const { gpu } = useContext(ViewPageContext);

  if (
    !gpu.company &&
    !hasProductFieldFormattedValue(gpu.fields?.architecture) &&
    !hasProductFieldFormattedValue(gpu.fields?.marketSegment) &&
    !hasProductFieldFormattedValue(gpu.fields?.releaseDate) &&
    !hasProductFieldFormattedValue(gpu.fields?.msrp) &&
    !hasProductFieldFormattedValue(gpu.fields?.productionStatus)
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
