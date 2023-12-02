import { hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContext';
import { PhysicalIntro } from './PhysicalIntro';
import { PhysicalTable } from './PhysicalTable';

interface PhysicalSpecsProps {
  className?: string;
}

export const PhysicalSpecs: FunctionComponent<PhysicalSpecsProps> = (props) => {
  const { className } = props;
  const { comparison } = useContext(ComparePageContext);
  const [cpu1, cpu2] = comparison;

  if (
    !hasProductFieldFormattedValue(cpu1.fields?.socket) &&
    !hasProductFieldFormattedValue(cpu2.fields?.socket) &&
    !hasProductFieldFormattedValue(cpu1.fields?.foundry) &&
    !hasProductFieldFormattedValue(cpu2.fields?.foundry) &&
    !hasProductFieldFormattedValue(cpu1.fields?.processSize) &&
    !hasProductFieldFormattedValue(cpu2.fields?.processSize) &&
    !hasProductFieldFormattedValue(cpu1.fields?.transistors) &&
    !hasProductFieldFormattedValue(cpu2.fields?.transistors) &&
    !hasProductFieldFormattedValue(cpu1.fields?.tCaseMax) &&
    !hasProductFieldFormattedValue(cpu2.fields?.tCaseMax) &&
    !hasProductFieldFormattedValue(cpu1.fields?.tjMax) &&
    !hasProductFieldFormattedValue(cpu2.fields?.tjMax)
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
