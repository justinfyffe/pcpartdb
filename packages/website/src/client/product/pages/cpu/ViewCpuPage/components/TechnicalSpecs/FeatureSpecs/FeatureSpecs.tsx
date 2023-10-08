import { hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContext';
import { FeatureIntro } from './FeatureIntro';
import { FeatureTable } from './FeatureTable';

interface FeatureSpecsProps {
  className?: string;
}

export const FeatureSpecs: FunctionComponent<FeatureSpecsProps> = (props) => {
  const { className } = props;
  const { cpu } = useContext(ViewPageContext);

  if (
    !hasProductFieldFormattedValue(cpu.fields?.bundledCooler) &&
    !hasProductFieldFormattedValue(cpu.fields?.integratedGraphics) &&
    !hasProductFieldFormattedValue(cpu.fields?.extensionsTechnologies)
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
