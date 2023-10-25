import { hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContext';
import { CoresIntro } from './CoresIntro';
import { CoresTable } from './CoresTable';

interface CoresSpecsProps {
  className?: string;
}

export const CoresSpecs: FunctionComponent<CoresSpecsProps> = (props) => {
  const { className } = props;
  const { cpu } = useContext(ViewPageContext);

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
      <h3 className="mb-0">Cores &amp; Clock Speeds</h3>
      <CoresIntro />
      <CoresTable />
    </section>
  );
};
