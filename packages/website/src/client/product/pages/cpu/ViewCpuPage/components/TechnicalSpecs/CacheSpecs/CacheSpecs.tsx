import { hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context';
import { CacheIntro } from './CacheIntro';
import { CacheTable } from './CacheTable';

interface CacheSpecsProps {
  className?: string;
}

export const CacheSpecs: FunctionComponent<CacheSpecsProps> = (props) => {
  const { className } = props;
  const { cpu } = useContext(ViewPageContext);

  if (
    !hasProductFieldValue(cpu.l1Cache) &&
    !hasProductFieldValue(cpu.l2Cache) &&
    !hasProductFieldValue(cpu.l3Cache) &&
    !hasProductFieldValue(cpu.efficientCoreL1Cache) &&
    !hasProductFieldValue(cpu.efficientCoreL2Cache)
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
