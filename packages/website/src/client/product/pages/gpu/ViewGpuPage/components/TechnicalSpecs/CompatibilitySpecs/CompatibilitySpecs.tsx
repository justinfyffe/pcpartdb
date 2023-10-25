import { hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContext';
import { CompatibilityIntro } from './CompatibilityIntro';
import { CompatibilityTable } from './CompatibilityTable';

interface CompatibilitySpecsProps {
  className?: string;
}

export const CompatibilitySpecs: FunctionComponent<CompatibilitySpecsProps> = (
  props,
) => {
  const { className } = props;
  const { gpu } = useContext(ViewPageContext);

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
      <h3 className="mb-0">Board Compatibility &amp; Dimensions</h3>
      <CompatibilityIntro />
      <CompatibilityTable />
    </section>
  );
};
