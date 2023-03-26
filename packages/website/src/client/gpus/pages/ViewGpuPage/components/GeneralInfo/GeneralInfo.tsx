import React, { FunctionComponent } from 'react';
import { GeneralInfoIntro } from './GeneralInfoIntro';
import { GeneralInfoTable } from './GeneralInfoTable';

export const GeneralInfo: FunctionComponent = () => {
  return (
    <section>
      <h2 className="mb-0 font-semibold">General Info</h2>
      <GeneralInfoIntro />
      <GeneralInfoTable className="mb-4" />
    </section>
  );
};
