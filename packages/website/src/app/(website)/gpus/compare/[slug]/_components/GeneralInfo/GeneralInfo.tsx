import {
  GpuProductComparison,
  hasProductFieldFormattedValue,
} from '@pcpartdb/shared';
import React from 'react';
import { GeneralInfoIntro } from './GeneralInfoIntro';
import { GeneralInfoTable } from './GeneralInfoTable';

interface GeneralInfoProps {
  comparison: GpuProductComparison;
}

export function GeneralInfo(props: GeneralInfoProps) {
  const { comparison } = props;
  const [gpu1, gpu2] = comparison;

  if (
    !gpu1.company &&
    !gpu2.company &&
    !hasProductFieldFormattedValue(gpu1.fields?.architecture) &&
    !hasProductFieldFormattedValue(gpu2.fields?.architecture) &&
    !hasProductFieldFormattedValue(gpu1.fields?.marketSegment) &&
    !hasProductFieldFormattedValue(gpu2.fields?.marketSegment) &&
    !hasProductFieldFormattedValue(gpu1.fields?.releaseDate) &&
    !hasProductFieldFormattedValue(gpu2.fields?.releaseDate) &&
    !hasProductFieldFormattedValue(gpu1.fields?.msrp) &&
    !hasProductFieldFormattedValue(gpu2.fields?.msrp) &&
    !hasProductFieldFormattedValue(gpu1.fields?.productionStatus) &&
    !hasProductFieldFormattedValue(gpu2.fields?.productionStatus)
  ) {
    return <></>;
  }

  return (
    <section>
      <h2 className="mb-1 font-semibold">General Info</h2>
      <GeneralInfoIntro comparison={comparison} />
      <GeneralInfoTable comparison={comparison} />
    </section>
  );
}
