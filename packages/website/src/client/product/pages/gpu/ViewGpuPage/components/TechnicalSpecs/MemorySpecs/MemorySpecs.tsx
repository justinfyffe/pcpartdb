import { hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContextProvider';
import { MemoryIntro } from './MemoryIntro';
import { MemoryTable } from './MemoryTable';

interface MemorySpecsProps {
  className?: string;
}

export const MemorySpecs: FunctionComponent<MemorySpecsProps> = (props) => {
  const { className } = props;
  const { gpu } = useContext(ViewPageContext);

  if (
    !hasProductFieldFormattedValue(gpu.fields?.memorySize) &&
    !hasProductFieldFormattedValue(gpu.fields?.memoryType) &&
    !hasProductFieldFormattedValue(gpu.fields?.memoryBandwidth) &&
    !hasProductFieldFormattedValue(gpu.fields?.memoryClock) &&
    !hasProductFieldFormattedValue(gpu.fields?.memoryInterface)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-1">Memory</h3>
      <MemoryIntro />
      <MemoryTable />
    </section>
  );
};
