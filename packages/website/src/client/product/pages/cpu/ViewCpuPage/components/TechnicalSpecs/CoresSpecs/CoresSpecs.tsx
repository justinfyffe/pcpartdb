import { hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context';
import { CoresIntro } from './CoresIntro';
import { CoresTable } from './CoresTable';

interface CoresSpecsProps {
  className?: string;
}

export const CoresSpecs: FunctionComponent<CoresSpecsProps> = (props) => {
  const { className } = props;
  const { cpu } = useContext(ViewPageContext);

  if (
    !hasProductFieldValue(cpu.coresCount) &&
    !hasProductFieldValue(cpu.threadsCount) &&
    !hasProductFieldValue(cpu.performanceCoresCount) &&
    !hasProductFieldValue(cpu.efficientCoresCount) &&
    !hasProductFieldValue(cpu.clock) &&
    !hasProductFieldValue(cpu.turboClock) &&
    !hasProductFieldValue(cpu.performanceCoreClock) &&
    !hasProductFieldValue(cpu.performanceCoreTurboClock) &&
    !hasProductFieldValue(cpu.efficientCoreClock) &&
    !hasProductFieldValue(cpu.efficientCoreTurboClock) &&
    !hasProductFieldValue(cpu.baseClock) &&
    !hasProductFieldValue(cpu.multiplier) &&
    !hasProductFieldValue(cpu.isMultiplierUnlocked)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-0">Cores &amp; Clock Speeds</h3>
      <CoresIntro />
      <CoresTable className="mb-4" />
    </section>
  );
};
