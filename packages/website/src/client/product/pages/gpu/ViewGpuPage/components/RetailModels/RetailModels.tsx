import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../context/ViewPageContext';
import { RetailModelsIntro } from './RetailModelsIntro';
import { RetailModelsTable } from './RetailModelsTable';
import { RetailModelsTitle } from './RetailModelsTitle';

export const RetailModels: FunctionComponent = () => {
  const { contentData } = useContext(ViewPageContext);

  if (contentData.retailModels?.length === 0) {
    return <></>;
  }

  return (
    <section>
      <RetailModelsTitle />
      <RetailModelsIntro />

      <section className="flex flex-wrap gap-8 mb-4">
        <RetailModelsTable />
      </section>
    </section>
  );
};
