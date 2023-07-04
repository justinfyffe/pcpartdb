import { hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../../context';
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
    !hasProductFieldValue(gpu1.codename) &&
    !hasProductFieldValue(gpu2.codename) &&
    !hasProductFieldValue(gpu1.architecture) &&
    !hasProductFieldValue(gpu2.architecture) &&
    !hasProductFieldValue(gpu1.processSize) &&
    !hasProductFieldValue(gpu2.processSize) &&
    !hasProductFieldValue(gpu1.transistors) &&
    !hasProductFieldValue(gpu2.transistors)
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
