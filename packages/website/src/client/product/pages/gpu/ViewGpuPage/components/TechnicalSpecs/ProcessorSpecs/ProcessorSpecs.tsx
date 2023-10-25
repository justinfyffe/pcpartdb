import { hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContext';
import { ProcessorIntro } from './ProcessorIntro';
import { ProcessorTable } from './ProcessorTable';

interface ProcessorSpecsProps {
  className?: string;
}

export const ProcessorSpecs: FunctionComponent<ProcessorSpecsProps> = (
  props,
) => {
  const { className } = props;
  const { gpu } = useContext(ViewPageContext);

  if (
    !hasProductFieldFormattedValue(gpu.fields?.codename) &&
    !hasProductFieldFormattedValue(gpu.fields?.architecture) &&
    !hasProductFieldFormattedValue(gpu.fields?.processSize) &&
    !hasProductFieldFormattedValue(gpu.fields?.transistors)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-0">Processor</h3>
      <ProcessorIntro />
      <ProcessorTable />
    </section>
  );
};
