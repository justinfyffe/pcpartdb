import {
  CpuProductComparison,
  hasProductFieldFormattedValue,
} from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { ArchitectureIntro } from './ArchitectureIntro';
import { ArchitectureTable } from './ArchitectureTable';

interface ArchitectureSpecsProps {
  comparison: CpuProductComparison;
  className?: string;
}

export const ArchitectureSpecs: FunctionComponent<ArchitectureSpecsProps> = (
  props,
) => {
  const { comparison, className } = props;
  const [cpu1, cpu2] = comparison;

  if (
    !hasProductFieldFormattedValue(cpu1.fields?.architecture) &&
    !hasProductFieldFormattedValue(cpu2.fields?.architecture) &&
    !hasProductFieldFormattedValue(cpu1.fields?.codename) &&
    !hasProductFieldFormattedValue(cpu2.fields?.codename) &&
    !hasProductFieldFormattedValue(cpu1.fields?.generation) &&
    !hasProductFieldFormattedValue(cpu2.fields?.generation) &&
    !hasProductFieldFormattedValue(cpu1.fields?.memorySupport) &&
    !hasProductFieldFormattedValue(cpu2.fields?.memorySupport) &&
    !hasProductFieldFormattedValue(cpu1.fields?.memoryChannels) &&
    !hasProductFieldFormattedValue(cpu2.fields?.memoryChannels) &&
    !hasProductFieldFormattedValue(cpu1.fields?.eccMemory) &&
    !hasProductFieldFormattedValue(cpu2.fields?.eccMemory) &&
    !hasProductFieldFormattedValue(cpu1.fields?.pciExpress) &&
    !hasProductFieldFormattedValue(cpu2.fields?.pciExpress)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-1">Architecture</h3>
      <ArchitectureIntro />
      <ArchitectureTable comparison={comparison} />
    </section>
  );
};
