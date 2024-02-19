import { CpuProduct, hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { CacheIntro } from './CacheIntro';
import { CacheTable } from './CacheTable';

interface CacheSpecsProps {
  cpu: CpuProduct;
  className?: string;
}

export const CacheSpecs: FunctionComponent<CacheSpecsProps> = (props) => {
  const { cpu, className } = props;

  if (
    !hasProductFieldFormattedValue(cpu.fields?.l1Cache) &&
    !hasProductFieldFormattedValue(cpu.fields?.l2Cache) &&
    !hasProductFieldFormattedValue(cpu.fields?.l3Cache) &&
    !hasProductFieldFormattedValue(cpu.fields?.eCoreL1Cache) &&
    !hasProductFieldFormattedValue(cpu.fields?.eCoreL2Cache)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-1">Cache</h3>
      <CacheIntro />
      <CacheTable cpu={cpu} />
    </section>
  );
};
