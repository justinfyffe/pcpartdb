import React, { FunctionComponent } from 'react';
import { MemoryIntro } from './MemoryIntro';
import { MemoryTable } from './MemoryTable';

interface MemorySpecsProps {
  className?: string;
}

export const MemorySpecs: FunctionComponent<MemorySpecsProps> = (props) => {
  const { className } = props;

  return (
    <section className={className}>
      <h3 className="mb-0">Memory</h3>
      <MemoryIntro />
      <MemoryTable className="mb-4" />
    </section>
  );
};
