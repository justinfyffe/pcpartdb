import {
  GpuProductComparison,
  hasProductFieldFormattedValue,
} from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { ApiIntro } from './ApiIntro';
import { ApiTable } from './ApiTable';

interface ApiSpecsProps {
  comparison: GpuProductComparison;
  className?: string;
}

export const ApiSpecs: FunctionComponent<ApiSpecsProps> = (props) => {
  const { comparison, className } = props;
  const [gpu1, gpu2] = comparison;

  if (
    !hasProductFieldFormattedValue(gpu1.fields?.directxVersion) &&
    !hasProductFieldFormattedValue(gpu2.fields?.directxVersion) &&
    !hasProductFieldFormattedValue(gpu1.fields?.openClVersion) &&
    !hasProductFieldFormattedValue(gpu2.fields?.openClVersion) &&
    !hasProductFieldFormattedValue(gpu1.fields?.openGlVersion) &&
    !hasProductFieldFormattedValue(gpu2.fields?.openGlVersion) &&
    !hasProductFieldFormattedValue(gpu1.fields?.shaderModelVersion) &&
    !hasProductFieldFormattedValue(gpu2.fields?.shaderModelVersion)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-1">API Support</h3>
      <ApiIntro />
      <ApiTable comparison={comparison} />
    </section>
  );
};
