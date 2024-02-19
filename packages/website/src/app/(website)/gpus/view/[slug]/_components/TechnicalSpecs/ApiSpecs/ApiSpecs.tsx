import { GpuProduct, hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { ApiIntro } from './ApiIntro';
import { ApiTable } from './ApiTable';

interface ApiSpecsProps {
  gpu: GpuProduct;
  className?: string;
}

export const ApiSpecs: FunctionComponent<ApiSpecsProps> = (props) => {
  const { gpu, className } = props;

  if (
    !hasProductFieldFormattedValue(gpu.fields?.directxVersion) &&
    !hasProductFieldFormattedValue(gpu.fields?.openClVersion) &&
    !hasProductFieldFormattedValue(gpu.fields?.openGlVersion) &&
    !hasProductFieldFormattedValue(gpu.fields?.shaderModelVersion)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-1">API Support</h3>
      <ApiIntro />
      <ApiTable gpu={gpu} />
    </section>
  );
};
