import { hasProductFieldValue } from '@pcpartdb/shared';
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
    !hasProductFieldValue(cpu1.socket) &&
    !hasProductFieldValue(cpu2.socket) &&
    !hasProductFieldValue(cpu1.foundry) &&
    !hasProductFieldValue(cpu2.foundry) &&
    !hasProductFieldValue(cpu1.processSize) &&
    !hasProductFieldValue(cpu2.processSize) &&
    !hasProductFieldValue(cpu1.transistors) &&
    !hasProductFieldValue(cpu2.transistors) &&
    !hasProductFieldValue(cpu1.tCaseMax) &&
    !hasProductFieldValue(cpu2.tCaseMax) &&
    !hasProductFieldValue(cpu1.tjMax) &&
    !hasProductFieldValue(cpu2.tjMax)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-0">Physical</h3>
      <PhysicalIntro />
      <PhysicalTable className="mb-4" />
    </section>
  );
};
