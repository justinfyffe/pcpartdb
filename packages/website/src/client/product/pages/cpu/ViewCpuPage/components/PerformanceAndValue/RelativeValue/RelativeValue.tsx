import { hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContext';
import { ValueIntro } from './ValueIntro';
import { ValueTable } from './ValueTable';

export const RelativeValue: FunctionComponent = () => {
  const { cpu, relativeValueCpus } = useContext(ViewPageContext);

  if (
    !hasProductFieldValue(cpu.fields?.performancePerMsrp) ||
    !relativeValueCpus?.length
  ) {
    return <></>;
  }

  return (
    <section>
      <h3 className="mb-0 font-semibold">Relative Value</h3>
      <ValueIntro />
      <ValueTable />
    </section>
  );
};
