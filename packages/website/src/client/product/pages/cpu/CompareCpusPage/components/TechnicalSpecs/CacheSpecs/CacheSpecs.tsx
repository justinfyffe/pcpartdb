import { hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContext';
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
    !hasProductFieldValue(cpu1.l1Cache) &&
    !hasProductFieldValue(cpu2.l1Cache) &&
    !hasProductFieldValue(cpu1.l2Cache) &&
    !hasProductFieldValue(cpu2.l2Cache) &&
    !hasProductFieldValue(cpu1.l3Cache) &&
    !hasProductFieldValue(cpu2.l3Cache) &&
    !hasProductFieldValue(cpu1.efficientCoreL1Cache) &&
    !hasProductFieldValue(cpu2.efficientCoreL1Cache) &&
    !hasProductFieldValue(cpu1.efficientCoreL2Cache) &&
    !hasProductFieldValue(cpu2.efficientCoreL2Cache)
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
