import { GpuProduct, GpuProductComparison } from '@pcpartdb/shared';
import React from 'react';
import { RetailModelsIntro } from './RetailModelsIntro';
import { RetailModelsTable } from './RetailModelsTable';
import { RetailModelsTitle } from './RetailModelsTitle';

interface RetailModelsProps {
  comparison: GpuProductComparison;
}

export function RetailModels(props: RetailModelsProps) {
  const { comparison } = props;
  const retailModels1 = comparison[0].children as GpuProduct[];
  const retailModels2 = comparison[1].children as GpuProduct[];

  if (
    (retailModels1 == null || retailModels1.length === 0) &&
    (retailModels2 == null || retailModels2.length === 0)
  ) {
    return <></>;
  }

  return (
    <section className="flex flex-col gap-4">
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
