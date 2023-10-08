import { hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContext';
import { CompatibilityIntro } from './CompatibilityIntro';
import { CompatibilityTable } from './CompatibilityTable';

interface CompatibilitySpecsProps {
  className?: string;
}

export const CompatibilitySpecs: FunctionComponent<CompatibilitySpecsProps> = (
  props,
) => {
  const { className } = props;
  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  if (
    !hasProductFieldFormattedValue(gpu1.fields?.slotWidth) &&
    !hasProductFieldFormattedValue(gpu2.fields?.slotWidth) &&
    !hasProductFieldFormattedValue(gpu1.fields?.length) &&
    !hasProductFieldFormattedValue(gpu2.fields?.length) &&
    !hasProductFieldFormattedValue(gpu1.fields?.width) &&
    !hasProductFieldFormattedValue(gpu2.fields?.width) &&
    !hasProductFieldFormattedValue(gpu1.fields?.height) &&
    !hasProductFieldFormattedValue(gpu2.fields?.height) &&
    !hasProductFieldFormattedValue(gpu1.fields?.weight) &&
    !hasProductFieldFormattedValue(gpu2.fields?.weight) &&
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
      <h3 className="mb-0">Board Compatibility &amp; Dimensions</h3>
      <CompatibilityIntro />
      <CompatibilityTable className="mb-4" />
    </section>
  );
};
