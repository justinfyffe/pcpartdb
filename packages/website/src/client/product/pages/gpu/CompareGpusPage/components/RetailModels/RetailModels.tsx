import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../context';
import { RetailModelsIntro } from './RetailModelsIntro';
import { RetailModelsTable } from './RetailModelsTable';
import { RetailModelsTitle } from './RetailModelsTitle';

export const RetailModels: FunctionComponent = () => {
  const { contentData } = useContext(ComparePageContext);
  const { retailModels1, retailModels2 } = contentData;

  if (retailModels1?.length === 0 && retailModels2?.length === 0) {
    return <></>;
  }

  return (
    <section>
      <RetailModelsTitle />
      <RetailModelsIntro />

      <section className="mb-4">
        <RetailModelsTable />
      </section>
    </section>
  );
};
