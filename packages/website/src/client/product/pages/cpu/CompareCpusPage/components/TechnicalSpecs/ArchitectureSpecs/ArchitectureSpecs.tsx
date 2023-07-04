import { hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../../context';
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
    !hasProductFieldValue(cpu1.architecture) &&
    !hasProductFieldValue(cpu2.architecture) &&
    !hasProductFieldValue(cpu1.codename) &&
    !hasProductFieldValue(cpu2.codename) &&
    !hasProductFieldValue(cpu1.generation) &&
    !hasProductFieldValue(cpu2.generation) &&
    !hasProductFieldValue(cpu1.memorySupport) &&
    !hasProductFieldValue(cpu2.memorySupport) &&
    !hasProductFieldValue(cpu1.memoryChannels) &&
    !hasProductFieldValue(cpu2.memoryChannels) &&
    !hasProductFieldValue(cpu1.hasEccMemory) &&
    !hasProductFieldValue(cpu2.hasEccMemory) &&
    !hasProductFieldValue(cpu1.pciExpress) &&
    !hasProductFieldValue(cpu2.pciExpress) &&
    !hasProductFieldValue(cpu1.chipsets) &&
    !hasProductFieldValue(cpu2.chipsets)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-0">Architecture</h3>
      <ArchitectureIntro />
      <ArchitectureTable className="mb-4" />
    </section>
  );
};
