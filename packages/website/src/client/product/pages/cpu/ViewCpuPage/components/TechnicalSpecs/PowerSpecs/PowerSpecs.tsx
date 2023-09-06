import { hasProductFieldValue } from '@pcpartdb/shared';
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
    !hasProductFieldValue(cpu.tdp) &&
    !hasProductFieldValue(cpu.pl1) &&
    !hasProductFieldValue(cpu.pl2) &&
    !hasProductFieldValue(cpu.ppt)
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
