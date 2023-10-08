import { hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContext';
import { CacheIntro } from './CacheIntro';
import { CacheTable } from './CacheTable';

interface CacheSpecsProps {
  className?: string;
}

export const CacheSpecs: FunctionComponent<CacheSpecsProps> = (props) => {
  const { className } = props;
  const { cpu } = useContext(ViewPageContext);

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
      <h3 className="mb-0">Cache</h3>
      <CacheIntro />
      <CacheTable className="mb-4" />
    </section>
  );
};
