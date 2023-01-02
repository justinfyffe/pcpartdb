import React, { FunctionComponent } from 'react';
import { ValueIntro } from './intro';
import { ValueTable } from './table';

export const RelativeValue: FunctionComponent = () => {
  return (
    <section>
      <h2 className="mb-0 font-semibold">Relative Value</h2>
      <ValueIntro />
      <ValueTable className="mb-4" />
    </section>
  );
};
