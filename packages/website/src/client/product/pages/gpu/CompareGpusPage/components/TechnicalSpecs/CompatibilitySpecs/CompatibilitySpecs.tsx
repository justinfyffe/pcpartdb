import { hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../../context';
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
    !hasProductFieldValue(gpu1.slotWidth) &&
    !hasProductFieldValue(gpu2.slotWidth) &&
    !hasProductFieldValue(gpu1.length) &&
    !hasProductFieldValue(gpu2.length) &&
    !hasProductFieldValue(gpu1.width) &&
    !hasProductFieldValue(gpu2.width) &&
    !hasProductFieldValue(gpu1.height) &&
    !hasProductFieldValue(gpu2.height) &&
    !hasProductFieldValue(gpu1.weight) &&
    !hasProductFieldValue(gpu2.weight) &&
    !hasProductFieldValue(gpu1.busInterface) &&
    !hasProductFieldValue(gpu2.busInterface) &&
    !hasProductFieldValue(gpu1.thermalDesignPower) &&
    !hasProductFieldValue(gpu2.thermalDesignPower) &&
    !hasProductFieldValue(gpu1.suggestedPsu) &&
    !hasProductFieldValue(gpu2.suggestedPsu) &&
    !hasProductFieldValue(gpu1.powerConnectors) &&
    !hasProductFieldValue(gpu2.powerConnectors) &&
    !hasProductFieldValue(gpu1.outputs) &&
    !hasProductFieldValue(gpu2.outputs)
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
