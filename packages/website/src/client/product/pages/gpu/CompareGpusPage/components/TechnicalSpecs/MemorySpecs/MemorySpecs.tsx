import { hasProductFieldFormattedValue } from '@pcpartdb/shared';
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
    !hasProductFieldFormattedValue(gpu1.fields?.memorySize) &&
    !hasProductFieldFormattedValue(gpu2.fields?.memorySize) &&
    !hasProductFieldFormattedValue(gpu1.fields?.memoryType) &&
    !hasProductFieldFormattedValue(gpu2.fields?.memoryType) &&
    !hasProductFieldFormattedValue(gpu1.fields?.memoryBandwidth) &&
    !hasProductFieldFormattedValue(gpu2.fields?.memoryBandwidth) &&
    !hasProductFieldFormattedValue(gpu1.fields?.memoryClock) &&
    !hasProductFieldFormattedValue(gpu2.fields?.memoryClock) &&
    !hasProductFieldFormattedValue(gpu1.fields?.memoryInterface) &&
    !hasProductFieldFormattedValue(gpu2.fields?.memoryInterface)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-0">Memory</h3>
      <MemoryIntro />
      <MemoryTable />
    </section>
  );
};
