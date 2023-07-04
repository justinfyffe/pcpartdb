import { hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../context';
import { ValueIntro } from './ValueIntro';
import { ValueTable } from './ValueTable';

export const RelativeValue: FunctionComponent = () => {
  const { comparison, contentData } = useContext(ComparePageContext);
  const [cpu1, cpu2] = comparison;
  const { relativeValueCpus } = contentData;

  if (
    !hasProductFieldValue(cpu1.valueScore) &&
    !hasProductFieldValue(cpu2.valueScore)
  ) {
    return <></>;
  }

  if (!relativeValueCpus?.length) {
    return <></>;
  }

  return (
    <section>
      <h2 className="mb-0 font-semibold">Relative Value</h2>
      <ValueIntro />
      <ValueTable className="mb-4" />
    </section>
  );
};
