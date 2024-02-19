import { GpuProduct, hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { CompatibilityIntro } from './CompatibilityIntro';
import { CompatibilityTable } from './CompatibilityTable';

interface CompatibilitySpecsProps {
  gpu: GpuProduct;
  className?: string;
}

export const CompatibilitySpecs: FunctionComponent<CompatibilitySpecsProps> = (
  props,
) => {
  const { gpu, className } = props;

  if (
    !hasProductFieldFormattedValue(gpu.fields?.slotWidth) &&
    !hasProductFieldFormattedValue(gpu.fields?.length) &&
    !hasProductFieldFormattedValue(gpu.fields?.width) &&
    !hasProductFieldFormattedValue(gpu.fields?.height) &&
    !hasProductFieldFormattedValue(gpu.fields?.weight) &&
    !hasProductFieldFormattedValue(gpu.fields?.busInterface) &&
    !hasProductFieldFormattedValue(gpu.fields?.tdp) &&
    !hasProductFieldFormattedValue(gpu.fields?.suggestedPsu) &&
    !hasProductFieldFormattedValue(gpu.fields?.powerConnectors) &&
    !hasProductFieldFormattedValue(gpu.fields?.outputs)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-1">Board Compatibility &amp; Dimensions</h3>
      <CompatibilityIntro />
      <CompatibilityTable gpu={gpu} />
    </section>
  );
};
