import {
  GpuProductComparison,
  hasProductFieldFormattedValue,
} from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { TheoreticalPerfIntro } from './TheoreticalPerfIntro';
import { TheoreticalPerfTable } from './TheoreticalPerfTable';

interface TheoreticalPerfSpecsProps {
  comparison: GpuProductComparison;
  className?: string;
}

export const TheoreticalPerfSpecs: FunctionComponent<
  TheoreticalPerfSpecsProps
> = (props) => {
  const { comparison, className } = props;
  const [gpu1, gpu2] = comparison;

  if (
    !hasProductFieldFormattedValue(gpu1.fields?.pixelRate) &&
    !hasProductFieldFormattedValue(gpu2.fields?.pixelRate) &&
    !hasProductFieldFormattedValue(gpu1.fields?.textureRate) &&
    !hasProductFieldFormattedValue(gpu2.fields?.textureRate) &&
    !hasProductFieldFormattedValue(gpu1.fields?.fp32) &&
    !hasProductFieldFormattedValue(gpu2.fields?.fp32) &&
    !hasProductFieldFormattedValue(gpu1.fields?.fp64) &&
    !hasProductFieldFormattedValue(gpu2.fields?.fp64)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-1">Theoretical Performance</h3>
      <TheoreticalPerfIntro />
      <TheoreticalPerfTable comparison={comparison} />
    </section>
  );
};
