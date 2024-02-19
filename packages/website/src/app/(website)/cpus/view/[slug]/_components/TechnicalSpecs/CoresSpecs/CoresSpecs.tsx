import { CpuProduct, hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { CoresIntro } from './CoresIntro';
import { CoresTable } from './CoresTable';

interface CoresSpecsProps {
  cpu: CpuProduct;
  className?: string;
}

export const CoresSpecs: FunctionComponent<CoresSpecsProps> = (props) => {
  const { cpu, className } = props;

  if (
    !hasProductFieldFormattedValue(cpu.fields?.cores) &&
    !hasProductFieldFormattedValue(cpu.fields?.threads) &&
    !hasProductFieldFormattedValue(cpu.fields?.pCores) &&
    !hasProductFieldFormattedValue(cpu.fields?.eCores) &&
    !hasProductFieldFormattedValue(cpu.fields?.clock) &&
    !hasProductFieldFormattedValue(cpu.fields?.turboClock) &&
    !hasProductFieldFormattedValue(cpu.fields?.pCoreClock) &&
    !hasProductFieldFormattedValue(cpu.fields?.pCoreTurboClock) &&
    !hasProductFieldFormattedValue(cpu.fields?.eCoreClock) &&
    !hasProductFieldFormattedValue(cpu.fields?.eCoreTurboClock) &&
    !hasProductFieldFormattedValue(cpu.fields?.baseClock) &&
    !hasProductFieldFormattedValue(cpu.fields?.multiplier) &&
    !hasProductFieldFormattedValue(cpu.fields?.multiplierUnlocked)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-1">Cores &amp; Clock Speeds</h3>
      <CoresIntro />
      <CoresTable cpu={cpu} />
    </section>
  );
};
