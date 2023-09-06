import { hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContext';
import { ArchitectureIntro } from './ArchitectureIntro';
import { ArchitectureTable } from './ArchitectureTable';

interface ArchitectureSpecsProps {
  className?: string;
}

export const ArchitectureSpecs: FunctionComponent<ArchitectureSpecsProps> = (
  props,
) => {
  const { className } = props;
  const { cpu } = useContext(ViewPageContext);

  if (
    !hasProductFieldValue(cpu.architecture) &&
    !hasProductFieldValue(cpu.codename) &&
    !hasProductFieldValue(cpu.generation) &&
    !hasProductFieldValue(cpu.memorySupport) &&
    !hasProductFieldValue(cpu.memoryChannels) &&
    !hasProductFieldValue(cpu.hasEccMemory) &&
    !hasProductFieldValue(cpu.pciExpress) &&
    !hasProductFieldValue(cpu.chipsets)
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
