import React, { FunctionComponent } from 'react';
import { ProcessorIntro } from './ProcessorIntro';
import { ProcessorTable } from './ProcessorTable';

interface ProcessorSpecsProps {
  className?: string;
}

export const ProcessorSpecs: FunctionComponent<ProcessorSpecsProps> = (
  props,
) => {
  const { className } = props;

  return (
    <section className={className}>
      <h3 className="mb-0">Processor</h3>
      <ProcessorIntro />
      <ProcessorTable className="mb-4" />
    </section>
  );
};
