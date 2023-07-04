import { hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context';
import { CoresIntro } from './CoresIntro';
import { CoresTable } from './CoresTable';

interface CoresSpecsProps {
  className?: string;
}

export const CoresSpecs: FunctionComponent<CoresSpecsProps> = (props) => {
  const { className } = props;
  const { gpu } = useContext(ViewPageContext);

  if (
    !hasProductFieldValue(gpu.shaderUnitsCudaCores) &&
    !hasProductFieldValue(gpu.computeUnitsSmCount) &&
    !hasProductFieldValue(gpu.textureMappingUnits) &&
    !hasProductFieldValue(gpu.renderOutputUnits) &&
    !hasProductFieldValue(gpu.tensorCores) &&
    !hasProductFieldValue(gpu.rayTracingCores) &&
    !hasProductFieldValue(gpu.coreClockSpeedBase) &&
    !hasProductFieldValue(gpu.coreClockSpeedBoost) &&
    !hasProductFieldValue(gpu.l1Cache) &&
    !hasProductFieldValue(gpu.l2Cache) &&
    !hasProductFieldValue(gpu.pixelFillRate) &&
    !hasProductFieldValue(gpu.textureFillRate) &&
    !hasProductFieldValue(gpu.fp32Performance) &&
    !hasProductFieldValue(gpu.fp64Performance)
  ) {
    return <></>;
  }

  return (
    <section className={className}>
      <h3 className="mb-0">Cores &amp; Clock Speeds</h3>
      <CoresIntro />
      <CoresTable className="mb-4" />
    </section>
  );
};
