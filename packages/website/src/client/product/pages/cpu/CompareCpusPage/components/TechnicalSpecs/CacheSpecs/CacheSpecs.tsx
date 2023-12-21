import { hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContextProvider';
import { CacheIntro } from './CacheIntro';
import { CacheTable } from './CacheTable';

interface CacheSpecsProps {
  className?: string;
}

export const CacheSpecs: FunctionComponent<CacheSpecsProps> = (props) => {
  const { className } = props;
  const { comparison } = useContext(ComparePageContext);
  const [cpu1, cpu2] = comparison;

  if (
    !hasProductFieldFormattedValue(cpu1.fields?.l1Cache) &&
    !hasProductFieldFormattedValue(cpu2.fields?.l1Cache) &&
    !hasProductFieldFormattedValue(cpu1.fields?.l2Cache) &&
    !hasProductFieldFormattedValue(cpu2.fields?.l2Cache) &&
    !hasProductFieldFormattedValue(cpu1.fields?.l3Cache) &&
    !hasProductFieldFormattedValue(cpu2.fields?.l3Cache) &&
    !hasProductFieldFormattedValue(cpu1.fields?.eCoreL1Cache) &&
    !hasProductFieldFormattedValue(cpu2.fields?.eCoreL1Cache) &&
    !hasProductFieldFormattedValue(cpu1.fields?.eCoreL2Cache) &&
    !hasProductFieldFormattedValue(cpu2.fields?.eCoreL2Cache)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-1">Cache</h3>
      <CacheIntro />
      <CacheTable />
    </section>
  );
};
