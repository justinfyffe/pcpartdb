import { formatProductName, GpuProduct } from '@pcpartdb/shared';
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

  const gpuName = formatProductName(gpu);
  const hasRetailModels = retailModels != null && retailModels.length > 0;

  if (retailModels == null || retailModels.length === 0) {
    return <></>;
  }

  return (
    <section className="flex flex-col gap-4">
      <RetailModelsTitle />
      {hasRetailModels && (
        <>
          <RetailModelsIntro />
          <RetailModelsTable gpu={gpu} retailModels={retailModels} />
        </>
      )}

      {!hasRetailModels && (
        <div className="text-center py-8">
          Our database does not have any retail cards for the {gpuName}.
        </div>
      )}
    </section>
  );
}
