import { hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContext';
import { ValueIntro } from './ValueIntro';
import { ValueTable } from './ValueTable';

export const RelativeValue: FunctionComponent = () => {
  const { gpu, additionalData: contentData } = useContext(ViewPageContext);
  const { relativeValueGpus } = contentData;

  if (
    !hasProductFieldValue(gpu.fields?.performancePerMsrp) ||
    !relativeValueGpus?.length
  ) {
    return <></>;
  }

  return (
    <section>
      <h3 className="mb-0 font-semibold">Relative Value</h3>
      <ValueIntro />

      <section className="flex flex-wrap gap-8 mb-4">
        <ValueTable />
      </section>
    </section>
  );
};
