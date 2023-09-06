import { hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContext';
import { MemoryIntro } from './MemoryIntro';
import { MemoryTable } from './MemoryTable';

interface MemorySpecsProps {
  className?: string;
}

export const MemorySpecs: FunctionComponent<MemorySpecsProps> = (props) => {
  const { className } = props;
  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  if (
    !hasProductFieldValue(gpu1.memorySize) &&
    !hasProductFieldValue(gpu2.memorySize) &&
    !hasProductFieldValue(gpu1.memoryType) &&
    !hasProductFieldValue(gpu2.memoryType) &&
    !hasProductFieldValue(gpu1.memoryBandwidth) &&
    !hasProductFieldValue(gpu2.memoryBandwidth) &&
    !hasProductFieldValue(gpu1.memoryClock) &&
    !hasProductFieldValue(gpu2.memoryClock) &&
    !hasProductFieldValue(gpu1.memoryInterface) &&
    !hasProductFieldValue(gpu2.memoryInterface)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-0">Memory</h3>
      <MemoryIntro />
      <MemoryTable className="mb-4" />
    </section>
  );
};
