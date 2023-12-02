import { hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContext';
import { PhysicalIntro } from './PhysicalIntro';
import { PhysicalTable } from './PhysicalTable';

interface PhysicalSpecsProps {
  className?: string;
}

export const PhysicalSpecs: FunctionComponent<PhysicalSpecsProps> = (props) => {
  const { className } = props;
  const { cpu } = useContext(ViewPageContext);

  if (
    !hasProductFieldFormattedValue(cpu.fields?.socket) &&
    !hasProductFieldFormattedValue(cpu.fields?.foundry) &&
    !hasProductFieldFormattedValue(cpu.fields?.processSize) &&
    !hasProductFieldFormattedValue(cpu.fields?.transistors) &&
    !hasProductFieldFormattedValue(cpu.fields?.tCaseMax) &&
    !hasProductFieldFormattedValue(cpu.fields?.tjMax)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-1">Physical</h3>
      <PhysicalIntro />
      <PhysicalTable />
    </section>
  );
};
