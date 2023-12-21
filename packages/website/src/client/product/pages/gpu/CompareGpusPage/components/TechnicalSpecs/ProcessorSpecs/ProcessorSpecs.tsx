import { hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContextProvider';
import { ProcessorIntro } from './ProcessorIntro';
import { ProcessorTable } from './ProcessorTable';

interface ProcessorSpecsProps {
  className?: string;
}

export const ProcessorSpecs: FunctionComponent<ProcessorSpecsProps> = (
  props,
) => {
  const { className } = props;
  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  if (
    !hasProductFieldFormattedValue(gpu1.fields?.codename) &&
    !hasProductFieldFormattedValue(gpu2.fields?.codename) &&
    !hasProductFieldFormattedValue(gpu1.fields?.architecture) &&
    !hasProductFieldFormattedValue(gpu2.fields?.architecture) &&
    !hasProductFieldFormattedValue(gpu1.fields?.processSize) &&
    !hasProductFieldFormattedValue(gpu2.fields?.processSize) &&
    !hasProductFieldFormattedValue(gpu1.fields?.transistors) &&
    !hasProductFieldFormattedValue(gpu2.fields?.transistors)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-1">Processor</h3>
      <ProcessorIntro />
      <ProcessorTable />
    </section>
  );
};
