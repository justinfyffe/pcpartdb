import { CpuProduct, hasProductFieldFormattedValue } from '@pcpartdb/shared';
import React from 'react';
import { GeneralInfoIntro } from './GeneralInfoIntro';
import { GeneralInfoTable } from './GeneralInfoTable';

interface GeneralInfoProps {
  cpu: CpuProduct;
}

export function GeneralInfo(props: GeneralInfoProps) {
  const { cpu } = props;

  if (
    !cpu.company &&
    !hasProductFieldFormattedValue(cpu.fields?.marketSegment) &&
    !hasProductFieldFormattedValue(cpu.fields?.msrp) &&
    !hasProductFieldFormattedValue(cpu.fields?.generation) &&
    !hasProductFieldFormattedValue(cpu.fields?.releaseDate) &&
    !hasProductFieldFormattedValue(cpu.fields?.productionStatus)
  ) {
    return <></>;
  }

  return (
    <section>
      <h2 className="mb-1 font-semibold">General Info</h2>
      <GeneralInfoIntro />
      <GeneralInfoTable cpu={cpu} />
    </section>
  );
}
