import { CpuProduct, hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { FeatureIntro } from './FeatureIntro';
import { FeatureTable } from './FeatureTable';

interface FeatureSpecsProps {
  cpu: CpuProduct;
  className?: string;
}

export const FeatureSpecs: FunctionComponent<FeatureSpecsProps> = (props) => {
  const { cpu, className } = props;

  if (
    !hasProductFieldFormattedValue(cpu.fields?.bundledCooler) &&
    !hasProductFieldFormattedValue(cpu.fields?.integratedGraphics) &&
    !hasProductFieldFormattedValue(cpu.fields?.extensionsTechnologies)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-1">Graphics, Features, &amp; Extensions</h3>
      <FeatureIntro />
      <FeatureTable cpu={cpu} />
    </section>
  );
};
