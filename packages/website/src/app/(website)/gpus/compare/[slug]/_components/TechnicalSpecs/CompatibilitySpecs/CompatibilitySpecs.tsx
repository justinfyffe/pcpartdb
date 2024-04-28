import {
  GpuProductComparison,
  hasProductFieldFormattedValue,
} from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { CompatibilityIntro } from './CompatibilityIntro';
import { CompatibilityTable } from './CompatibilityTable';

interface CompatibilitySpecsProps {
  comparison: GpuProductComparison;
  className?: string;
}

export const CompatibilitySpecs: FunctionComponent<CompatibilitySpecsProps> = (
  props,
) => {
  const { comparison, className } = props;
  const [gpu1, gpu2] = comparison;

  if (
    !hasProductFieldFormattedValue(gpu1.fields?.slotWidth) &&
    !hasProductFieldFormattedValue(gpu2.fields?.slotWidth) &&
    !hasProductFieldFormattedValue(gpu1.fields?.busInterface) &&
    !hasProductFieldFormattedValue(gpu2.fields?.busInterface) &&
    !hasProductFieldFormattedValue(gpu1.fields?.tdp) &&
    !hasProductFieldFormattedValue(gpu2.fields?.tdp) &&
    !hasProductFieldFormattedValue(gpu1.fields?.suggestedPsu) &&
    !hasProductFieldFormattedValue(gpu2.fields?.suggestedPsu) &&
    !hasProductFieldFormattedValue(gpu1.fields?.powerConnectors) &&
    !hasProductFieldFormattedValue(gpu2.fields?.powerConnectors) &&
    !hasProductFieldFormattedValue(gpu1.fields?.outputs) &&
    !hasProductFieldFormattedValue(gpu2.fields?.outputs)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-1">Board Compatibility</h3>
      <CompatibilityIntro />
      <CompatibilityTable comparison={comparison} />
    </section>
  );
};
