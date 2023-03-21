import React, { FunctionComponent } from 'react';
import { CompatibilityIntro } from './CompatibilityIntro';
import { CompatibilityTable } from './CompatibilityTable';

interface CompatibilitySpecsProps {
  className?: string;
}

export const CompatibilitySpecs: FunctionComponent<CompatibilitySpecsProps> = (
  props,
) => {
  const { className } = props;

  return (
    <section className={className}>
      <h3 className="mb-0">Board Compatibility &amp; Dimensions</h3>
      <CompatibilityIntro />
      <CompatibilityTable className="mb-4" />
    </section>
  );
};
