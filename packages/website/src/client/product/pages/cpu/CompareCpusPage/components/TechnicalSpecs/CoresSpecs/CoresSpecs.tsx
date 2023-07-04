import { hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../../context';
import { CoresIntro } from './CoresIntro';
import { CoresTable } from './CoresTable';

interface CoresSpecsProps {
  className?: string;
}

export const CoresSpecs: FunctionComponent<CoresSpecsProps> = (props) => {
  const { className } = props;
  const { comparison } = useContext(ComparePageContext);
  const [cpu1, cpu2] = comparison;

  if (
    !hasProductFieldValue(cpu1.coresCount) &&
    !hasProductFieldValue(cpu2.coresCount) &&
    !hasProductFieldValue(cpu1.threadsCount) &&
    !hasProductFieldValue(cpu2.threadsCount) &&
    !hasProductFieldValue(cpu1.performanceCoresCount) &&
    !hasProductFieldValue(cpu2.performanceCoresCount) &&
    !hasProductFieldValue(cpu1.efficientCoresCount) &&
    !hasProductFieldValue(cpu2.efficientCoresCount) &&
    !hasProductFieldValue(cpu1.clock) &&
    !hasProductFieldValue(cpu2.clock) &&
    !hasProductFieldValue(cpu1.turboClock) &&
    !hasProductFieldValue(cpu2.turboClock) &&
    !hasProductFieldValue(cpu1.performanceCoreClock) &&
    !hasProductFieldValue(cpu2.performanceCoreClock) &&
    !hasProductFieldValue(cpu1.performanceCoreTurboClock) &&
    !hasProductFieldValue(cpu2.performanceCoreTurboClock) &&
    !hasProductFieldValue(cpu1.efficientCoreClock) &&
    !hasProductFieldValue(cpu2.efficientCoreClock) &&
    !hasProductFieldValue(cpu1.efficientCoreTurboClock) &&
    !hasProductFieldValue(cpu2.efficientCoreTurboClock) &&
    !hasProductFieldValue(cpu1.baseClock) &&
    !hasProductFieldValue(cpu2.baseClock) &&
    !hasProductFieldValue(cpu1.multiplier) &&
    !hasProductFieldValue(cpu2.multiplier) &&
    !hasProductFieldValue(cpu1.isMultiplierUnlocked) &&
    !hasProductFieldValue(cpu2.isMultiplierUnlocked)
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
