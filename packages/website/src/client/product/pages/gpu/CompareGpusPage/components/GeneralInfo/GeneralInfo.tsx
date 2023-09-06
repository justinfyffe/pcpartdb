import { hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../context/ComparePageContext';
import { GeneralInfoIntro } from './GeneralInfoIntro';
import { GeneralInfoTable } from './GeneralInfoTable';

export const GeneralInfo: FunctionComponent = () => {
  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  if (
    !hasProductFieldValue(gpu1.performanceScore) &&
    !hasProductFieldValue(gpu2.performanceScore) &&
    !hasProductFieldValue(gpu1.valueScore) &&
    !hasProductFieldValue(gpu2.valueScore) &&
    !hasProductFieldValue(gpu1.company) &&
    !hasProductFieldValue(gpu2.company) &&
    !hasProductFieldValue(gpu1.marketSegment) &&
    !hasProductFieldValue(gpu2.marketSegment) &&
    !hasProductFieldValue(gpu1.releaseDate) &&
    !hasProductFieldValue(gpu2.releaseDate) &&
    !hasProductFieldValue(gpu1.launchPrice) &&
    !hasProductFieldValue(gpu2.launchPrice) &&
    !hasProductFieldValue(gpu1.releaseDate) &&
    !hasProductFieldValue(gpu2.releaseDate)
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
