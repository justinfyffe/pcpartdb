import { hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContextProvider';
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
    !hasProductFieldFormattedValue(cpu1.fields?.cores) &&
    !hasProductFieldFormattedValue(cpu2.fields?.cores) &&
    !hasProductFieldFormattedValue(cpu1.fields?.threads) &&
    !hasProductFieldFormattedValue(cpu2.fields?.threads) &&
    !hasProductFieldFormattedValue(cpu1.fields?.pCores) &&
    !hasProductFieldFormattedValue(cpu2.fields?.pCores) &&
    !hasProductFieldFormattedValue(cpu1.fields?.eCores) &&
    !hasProductFieldFormattedValue(cpu2.fields?.eCores) &&
    !hasProductFieldFormattedValue(cpu1.fields?.clock) &&
    !hasProductFieldFormattedValue(cpu2.fields?.clock) &&
    !hasProductFieldFormattedValue(cpu1.fields?.turboClock) &&
    !hasProductFieldFormattedValue(cpu2.fields?.turboClock) &&
    !hasProductFieldFormattedValue(cpu1.fields?.pCoreClock) &&
    !hasProductFieldFormattedValue(cpu2.fields?.pCoreClock) &&
    !hasProductFieldFormattedValue(cpu1.fields?.pCoreTurboClock) &&
    !hasProductFieldFormattedValue(cpu2.fields?.pCoreTurboClock) &&
    !hasProductFieldFormattedValue(cpu1.fields?.eCoreClock) &&
    !hasProductFieldFormattedValue(cpu2.fields?.eCoreClock) &&
    !hasProductFieldFormattedValue(cpu1.fields?.eCoreTurboClock) &&
    !hasProductFieldFormattedValue(cpu2.fields?.eCoreTurboClock) &&
    !hasProductFieldFormattedValue(cpu1.fields?.baseClock) &&
    !hasProductFieldFormattedValue(cpu2.fields?.baseClock) &&
    !hasProductFieldFormattedValue(cpu1.fields?.multiplier) &&
    !hasProductFieldFormattedValue(cpu2.fields?.multiplier) &&
    !hasProductFieldFormattedValue(cpu1.fields?.multiplierUnlocked) &&
    !hasProductFieldFormattedValue(cpu2.fields?.multiplierUnlocked)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-1">Cores &amp; Clock Speeds</h3>
      <CoresIntro />
      <CoresTable />
    </section>
  );
};
