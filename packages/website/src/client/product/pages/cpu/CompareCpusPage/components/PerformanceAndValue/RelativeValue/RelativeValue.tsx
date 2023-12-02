import { hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContext';
import { ValueIntro } from './ValueIntro';
import { ValueTable } from './ValueTable';

export const RelativeValue: FunctionComponent = () => {
  const { comparison, relativeValueCpus } = useContext(ComparePageContext);
  const [cpu1, cpu2] = comparison;

  if (
    !hasProductFieldValue(cpu1.fields?.performancePerMsrp) &&
    !hasProductFieldValue(cpu2.fields?.performancePerMsrp)
  ) {
    return <></>;
  }

  if (!relativeValueCpus?.length) {
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
