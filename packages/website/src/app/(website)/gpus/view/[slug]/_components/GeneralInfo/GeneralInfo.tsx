import { GpuProduct, hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React from 'react';
import { GeneralInfoIntro } from './GeneralInfoIntro';
import { GeneralInfoTable } from './GeneralInfoTable';

interface GeneralInfoProps {
  gpu: GpuProduct;
}

export function GeneralInfo(props: GeneralInfoProps) {
  const { gpu } = props;
  if (
    !gpu.company &&
    !hasProductFieldFormattedValue(gpu.fields?.architecture) &&
    !hasProductFieldFormattedValue(gpu.fields?.marketSegment) &&
    !hasProductFieldFormattedValue(gpu.fields?.releaseDate) &&
    !hasProductFieldFormattedValue(gpu.fields?.msrp) &&
    !hasProductFieldFormattedValue(gpu.fields?.productionStatus)
  ) {
    return <></>;
  }

  return (
    <section>
      <h2 className="mb-1 font-semibold">General Info</h2>
      <GeneralInfoIntro />
      <GeneralInfoTable gpu={gpu} />
    </section>
  );
}
