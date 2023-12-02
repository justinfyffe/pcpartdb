import { hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../context/ComparePageContext';
import { GeneralInfoIntro } from './GeneralInfoIntro';
import { GeneralInfoTable } from './GeneralInfoTable';

export const GeneralInfo: FunctionComponent = () => {
  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  if (
    !hasProductFieldFormattedValue(gpu1.fields?.performanceRating) &&
    !hasProductFieldFormattedValue(gpu2.fields?.performanceRating) &&
    !hasProductFieldFormattedValue(gpu1.fields?.performancePerMsrp) &&
    !hasProductFieldFormattedValue(gpu2.fields?.performancePerMsrp) &&
    !gpu1.company &&
    !gpu2.company &&
    !hasProductFieldFormattedValue(gpu1.fields?.marketSegment) &&
    !hasProductFieldFormattedValue(gpu2.fields?.marketSegment) &&
    !hasProductFieldFormattedValue(gpu1.fields?.releaseDate) &&
    !hasProductFieldFormattedValue(gpu2.fields?.releaseDate) &&
    !hasProductFieldFormattedValue(gpu1.fields?.msrp) &&
    !hasProductFieldFormattedValue(gpu2.fields?.msrp) &&
    !hasProductFieldFormattedValue(gpu1.fields?.productionStatus) &&
    !hasProductFieldFormattedValue(gpu2.fields?.productionStatus)
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
