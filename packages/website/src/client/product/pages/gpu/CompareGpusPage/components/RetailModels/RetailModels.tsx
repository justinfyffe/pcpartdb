import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../context/ComparePageContext';
import { RetailModelsIntro } from './RetailModelsIntro';
import { RetailModelsTable } from './RetailModelsTable';
import { RetailModelsTitle } from './RetailModelsTitle';

export const RetailModels: FunctionComponent = () => {
  const { retailModels1, retailModels2 } = useContext(ComparePageContext);

  if (retailModels1?.length === 0 && retailModels2?.length === 0) {
    return <></>;
  }

  return (
    <section>
      <RetailModelsTitle />
      <RetailModelsIntro />
      <RetailModelsTable />
    </section>
  );
};
