import { hasProductFieldValue } from '@pcpartdb/shared';
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
    !hasProductFieldValue(cpu1.tdp) &&
    !hasProductFieldValue(cpu2.tdp) &&
    !hasProductFieldValue(cpu1.pl1) &&
    !hasProductFieldValue(cpu2.pl1) &&
    !hasProductFieldValue(cpu1.pl2) &&
    !hasProductFieldValue(cpu2.pl2) &&
    !hasProductFieldValue(cpu1.ppt) &&
    !hasProductFieldValue(cpu2.ppt)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-0">Power Consumption</h3>
      <PowerIntro />
      <PowerTable className="mb-4" />
    </section>
  );
};
