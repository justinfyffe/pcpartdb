import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../context/ViewPageContextProvider';
import { RetailModelsIntro } from './RetailModelsIntro';
import { RetailModelsTable } from './RetailModelsTable';
import { RetailModelsTitle } from './RetailModelsTitle';

export const RetailModels: FunctionComponent = () => {
  const { retailModels } = useContext(ViewPageContext);

  if (retailModels?.length === 0) {
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
