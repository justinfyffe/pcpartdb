import { hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContextProvider';
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
    !hasProductFieldFormattedValue(cpu1.fields?.bundledCooler) &&
    !hasProductFieldFormattedValue(cpu2.fields?.bundledCooler) &&
    !hasProductFieldFormattedValue(cpu1.fields?.integratedGraphics) &&
    !hasProductFieldFormattedValue(cpu2.fields?.integratedGraphics) &&
    !hasProductFieldFormattedValue(cpu1.fields?.extensionsTechnologies) &&
    !hasProductFieldFormattedValue(cpu2.fields?.extensionsTechnologies)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-1">Graphics, Features, &amp; Extensions</h3>
      <FeatureIntro />
      <FeatureTable />
    </section>
  );
};
