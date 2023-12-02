import { getGpuChipset, hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContext';
import { ValueIntro } from './ValueIntro';
import { ValueTable } from './ValueTable';

export const RelativeValue: FunctionComponent = () => {
  const { gpu, relativeValueGpus } = useContext(ViewPageContext);
  const chipset = getGpuChipset(gpu);

  if (
    !hasProductFieldValue(chipset.fields?.performancePerMsrp) ||
    !relativeValueGpus?.length
  ) {
    return <></>;
  }

  return (
    <section>
      <h3 className="mb-1 font-semibold">Relative Value</h3>
      <ValueIntro />
      <ValueTable />
    </section>
  );
};
