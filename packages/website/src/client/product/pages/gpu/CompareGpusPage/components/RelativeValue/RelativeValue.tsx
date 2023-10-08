import { getGpuChipset, hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ComparePageContext } from '../../context/ComparePageContext';
import { ValueIntro } from './ValueIntro';
import { ValueTable } from './ValueTable';

export const RelativeValue: FunctionComponent = () => {
  const { comparison, additionalData: contentData } =
    useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;
  const { relativeValueGpus } = contentData;

  const chipset1 = useMemo(() => getGpuChipset(gpu1), [gpu1]);
  const chipset2 = useMemo(() => getGpuChipset(gpu2), [gpu2]);

  if (
    !hasProductFieldValue(chipset1.fields?.performancePerMsrp) &&
    !hasProductFieldValue(chipset2.fields?.performancePerMsrp)
  ) {
    return <></>;
  }

  if (!relativeValueGpus?.length) {
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
