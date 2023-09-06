import { hasProductFieldValue } from '@pcpartdb/shared';
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
    !hasProductFieldValue(gpu.slotWidth) &&
    !hasProductFieldValue(gpu.length) &&
    !hasProductFieldValue(gpu.width) &&
    !hasProductFieldValue(gpu.height) &&
    !hasProductFieldValue(gpu.weight) &&
    !hasProductFieldValue(gpu.busInterface) &&
    !hasProductFieldValue(gpu.thermalDesignPower) &&
    !hasProductFieldValue(gpu.suggestedPsu) &&
    !hasProductFieldValue(gpu.powerConnectors) &&
    !hasProductFieldValue(gpu.outputs)
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
