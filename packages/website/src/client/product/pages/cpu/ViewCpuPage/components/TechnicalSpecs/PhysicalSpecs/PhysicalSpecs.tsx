import { hasProductFieldValue } from '@pcpartdb/shared';
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
    !hasProductFieldValue(cpu.socket) &&
    !hasProductFieldValue(cpu.foundry) &&
    !hasProductFieldValue(cpu.processSize) &&
    !hasProductFieldValue(cpu.transistors) &&
    !hasProductFieldValue(cpu.tCaseMax) &&
    !hasProductFieldValue(cpu.tjMax)
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
