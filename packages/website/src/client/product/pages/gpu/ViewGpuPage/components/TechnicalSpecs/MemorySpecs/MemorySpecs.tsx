import { hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContext';
import { MemoryIntro } from './MemoryIntro';
import { MemoryTable } from './MemoryTable';

interface MemorySpecsProps {
  className?: string;
}

export const MemorySpecs: FunctionComponent<MemorySpecsProps> = (props) => {
  const { className } = props;
  const { gpu } = useContext(ViewPageContext);

  if (
    !hasProductFieldValue(gpu.memorySize) &&
    !hasProductFieldValue(gpu.memoryType) &&
    !hasProductFieldValue(gpu.memoryBandwidth) &&
    !hasProductFieldValue(gpu.memoryClock) &&
    !hasProductFieldValue(gpu.memoryInterface)
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
