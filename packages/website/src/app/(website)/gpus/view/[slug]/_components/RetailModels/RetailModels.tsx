import { GpuProduct } from '@pcpartdb/shared';
import React from 'react';
import { RetailModelsIntro } from './RetailModelsIntro';
import { RetailModelsTable } from './RetailModelsTable';
import { RetailModelsTitle } from './RetailModelsTitle';

interface RetailModelsProps {
  gpu: GpuProduct;
  retailModels: Partial<GpuProduct>[];
}

export function RetailModels(props: RetailModelsProps) {
  const { gpu, retailModels } = props;

  if (retailModels == null || retailModels.length === 0) {
    return <></>;
  }

  return (
    <section>
      <RetailModelsTitle />
      <RetailModelsIntro />
      <RetailModelsTable gpu={gpu} retailModels={retailModels} />
    </section>
  );
}
