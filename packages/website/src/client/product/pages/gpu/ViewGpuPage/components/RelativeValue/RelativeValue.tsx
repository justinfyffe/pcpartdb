import { hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../context';
import { ValueIntro } from './ValueIntro';
import { ValueTable } from './ValueTable';

export const RelativeValue: FunctionComponent = () => {
  const { gpu, contentData } = useContext(ViewPageContext);
  const { relativeValueGpus } = contentData;

  if (!hasProductFieldValue(gpu.valueScore) || !relativeValueGpus?.length) {
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
