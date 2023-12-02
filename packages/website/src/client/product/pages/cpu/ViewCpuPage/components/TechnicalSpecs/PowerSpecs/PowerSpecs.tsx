import { hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContext';
import { PowerIntro } from './PowerIntro';
import { PowerTable } from './PowerTable';

interface PowerSpecsProps {
  className?: string;
}

export const PowerSpecs: FunctionComponent<PowerSpecsProps> = (props) => {
  const { className } = props;
  const { cpu } = useContext(ViewPageContext);

  if (
    !hasProductFieldFormattedValue(cpu.fields?.tdp) &&
    !hasProductFieldFormattedValue(cpu.fields?.pl1) &&
    !hasProductFieldFormattedValue(cpu.fields?.pl2) &&
    !hasProductFieldFormattedValue(cpu.fields?.ppt)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-1">Power Consumption</h3>
      <PowerIntro />
      <PowerTable />
    </section>
  );
};
