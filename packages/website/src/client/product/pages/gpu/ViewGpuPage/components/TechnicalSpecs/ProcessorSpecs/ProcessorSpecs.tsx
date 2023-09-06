import { hasProductFieldValue } from '@pcpartdb/shared';
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
    !hasProductFieldValue(gpu.codename) &&
    !hasProductFieldValue(gpu.architecture) &&
    !hasProductFieldValue(gpu.processSize) &&
    !hasProductFieldValue(gpu.transistors)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-0">Processor</h3>
      <ProcessorIntro />
      <ProcessorTable className="mb-4" />
    </section>
  );
};
