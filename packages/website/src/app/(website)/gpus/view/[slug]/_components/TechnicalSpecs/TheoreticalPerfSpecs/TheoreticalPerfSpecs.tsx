import { GpuProduct, hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { TheoreticalPerfIntro } from './TheoreticalPerfIntro';
import { TheoreticalPerfTable } from './TheoreticalPerfTable';

interface TheoreticalPerfSpecsProps {
  gpu: GpuProduct;
  className?: string;
}

export const TheoreticalPerfSpecs: FunctionComponent<
  TheoreticalPerfSpecsProps
> = (props) => {
  const { gpu, className } = props;

  if (
    !hasProductFieldFormattedValue(gpu.fields?.pixelRate) &&
    !hasProductFieldFormattedValue(gpu.fields?.textureRate) &&
    !hasProductFieldFormattedValue(gpu.fields?.fp32) &&
    !hasProductFieldFormattedValue(gpu.fields?.fp64)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-1">Theoretical Performance</h3>
      <TheoreticalPerfIntro />
      <TheoreticalPerfTable gpu={gpu} />
    </section>
  );
};
