import { hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContext';
import { ArchitectureIntro } from './ArchitectureIntro';
import { ArchitectureTable } from './ArchitectureTable';

interface ArchitectureSpecsProps {
  className?: string;
}

export const ArchitectureSpecs: FunctionComponent<ArchitectureSpecsProps> = (
  props,
) => {
  const { className } = props;
  const { comparison } = useContext(ComparePageContext);
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
    !hasProductFieldFormattedValue(cpu2.fields?.pciExpress) &&
    !hasProductFieldFormattedValue(cpu1.fields?.chipsets) &&
    !hasProductFieldFormattedValue(cpu2.fields?.chipsets)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-0">Architecture</h3>
      <ArchitectureIntro />
      <ArchitectureTable />
    </section>
  );
};
