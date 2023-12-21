import { hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContextProvider';
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
    !hasProductFieldFormattedValue(cpu.fields?.architecture) &&
    !hasProductFieldFormattedValue(cpu.fields?.codename) &&
    !hasProductFieldFormattedValue(cpu.fields?.generation) &&
    !hasProductFieldFormattedValue(cpu.fields?.memorySupport) &&
    !hasProductFieldFormattedValue(cpu.fields?.memoryChannels) &&
    !hasProductFieldFormattedValue(cpu.fields?.eccMemory) &&
    !hasProductFieldFormattedValue(cpu.fields?.pciExpress) &&
    !hasProductFieldFormattedValue(cpu.fields?.chipsets)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-1">Architecture</h3>
      <ArchitectureIntro />
      <ArchitectureTable />
    </section>
  );
};
