import { hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../../context';
import { FeatureIntro } from './FeatureIntro';
import { FeatureTable } from './FeatureTable';

interface FeatureSpecsProps {
  className?: string;
}

export const FeatureSpecs: FunctionComponent<FeatureSpecsProps> = (props) => {
  const { className } = props;
  const { comparison } = useContext(ComparePageContext);
  const [cpu1, cpu2] = comparison;

  if (
    !hasProductFieldValue(cpu1.bundledCooler) &&
    !hasProductFieldValue(cpu2.bundledCooler) &&
    !hasProductFieldValue(cpu1.integratedGraphics) &&
    !hasProductFieldValue(cpu2.integratedGraphics) &&
    !hasProductFieldValue(cpu1.extensionsTechnologies) &&
    !hasProductFieldValue(cpu2.extensionsTechnologies)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-0">Graphics, Features, &amp; Extensions</h3>
      <FeatureIntro />
      <FeatureTable className="mb-4" />
    </section>
  );
};
