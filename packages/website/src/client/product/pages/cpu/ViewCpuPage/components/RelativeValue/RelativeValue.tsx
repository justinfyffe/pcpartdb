import { hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../context/ViewPageContext';
import { ValueIntro } from './ValueIntro';
import { ValueTable } from './ValueTable';

export const RelativeValue: FunctionComponent = () => {
  const { cpu, additionalData: contentData } = useContext(ViewPageContext);
  const { relativeValueCpus } = contentData;

  if (
    !hasProductFieldValue(cpu.fields?.performancePerMsrp) ||
    !relativeValueCpus?.length
  ) {
    return <></>;
  }

  return (
    <section>
      <h2 className="mb-0 font-semibold">Relative Value</h2>
      <ValueIntro />

      <section className="flex flex-wrap gap-8 mb-4">
        <ValueTable />
      </section>
    </section>
  );
};
