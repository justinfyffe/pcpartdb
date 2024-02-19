import { GpuProduct, GpuProductComparison } from '@pcpartdb/shared';
import React from 'react';
import { RetailModelsIntro } from './RetailModelsIntro';
import { RetailModelsTable } from './RetailModelsTable';
import { RetailModelsTitle } from './RetailModelsTitle';

interface RetailModelsProps {
  comparison: GpuProductComparison;
  retailModels1: Partial<GpuProduct>[];
  retailModels2: Partial<GpuProduct>[];
}

export function RetailModels(props: RetailModelsProps) {
  const { comparison, retailModels1, retailModels2 } = props;

  if (
    (retailModels1 == null || retailModels1.length === 0) &&
    (retailModels2 == null || retailModels2.length === 0)
  ) {
    return <></>;
  }

  return (
    <section>
      <RetailModelsTitle />
      <RetailModelsIntro />
      <RetailModelsTable
        comparison={comparison}
        retailModels1={retailModels1}
        retailModels2={retailModels2}
      />
    </section>
  );
}
