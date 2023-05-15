import { getChipset } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../context';
import { ValueIntro } from './ValueIntro';
import { ValueTable } from './ValueTable';

export const RelativeValue: FunctionComponent = () => {
  const { comparison } = useContext(ComparePageContext);
  const chipset1 = getChipset(comparison[0]);
  const chipset2 = getChipset(comparison[1]);

  if (
    chipset1.valueScore?.value == null &&
    chipset2.valueScore?.value == null
  ) {
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
