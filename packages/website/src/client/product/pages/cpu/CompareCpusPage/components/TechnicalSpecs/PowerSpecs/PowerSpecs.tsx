import { hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContext';
import { PowerIntro } from './PowerIntro';
import { PowerTable } from './PowerTable';

interface PowerSpecsProps {
  className?: string;
}

export const PowerSpecs: FunctionComponent<PowerSpecsProps> = (props) => {
  const { className } = props;
  const { comparison } = useContext(ComparePageContext);
  const [cpu1, cpu2] = comparison;

  if (
    !hasProductFieldFormattedValue(cpu1.fields?.tdp) &&
    !hasProductFieldFormattedValue(cpu2.fields?.tdp) &&
    !hasProductFieldFormattedValue(cpu1.fields?.pl1) &&
    !hasProductFieldFormattedValue(cpu2.fields?.pl1) &&
    !hasProductFieldFormattedValue(cpu1.fields?.pl2) &&
    !hasProductFieldFormattedValue(cpu2.fields?.pl2) &&
    !hasProductFieldFormattedValue(cpu1.fields?.ppt) &&
    !hasProductFieldFormattedValue(cpu2.fields?.ppt)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-0">Power Consumption</h3>
      <PowerIntro />
      <PowerTable />
    </section>
  );
};
