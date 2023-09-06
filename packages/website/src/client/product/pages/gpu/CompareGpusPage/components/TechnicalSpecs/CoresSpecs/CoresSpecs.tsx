import { hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContext';
import { CoresIntro } from './CoresIntro';
import { CoresTable } from './CoresTable';

interface CoresSpecsProps {
  className?: string;
}

export const CoresSpecs: FunctionComponent<CoresSpecsProps> = (props) => {
  const { className } = props;
  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  if (
    !hasProductFieldValue(gpu1.shaderUnitsCudaCores) &&
    !hasProductFieldValue(gpu2.shaderUnitsCudaCores) &&
    !hasProductFieldValue(gpu1.computeUnitsSmCount) &&
    !hasProductFieldValue(gpu2.computeUnitsSmCount) &&
    !hasProductFieldValue(gpu1.textureMappingUnits) &&
    !hasProductFieldValue(gpu2.textureMappingUnits) &&
    !hasProductFieldValue(gpu1.renderOutputUnits) &&
    !hasProductFieldValue(gpu2.renderOutputUnits) &&
    !hasProductFieldValue(gpu1.tensorCores) &&
    !hasProductFieldValue(gpu2.tensorCores) &&
    !hasProductFieldValue(gpu1.rayTracingCores) &&
    !hasProductFieldValue(gpu2.rayTracingCores) &&
    !hasProductFieldValue(gpu1.coreClockSpeedBase) &&
    !hasProductFieldValue(gpu2.coreClockSpeedBase) &&
    !hasProductFieldValue(gpu1.coreClockSpeedBoost) &&
    !hasProductFieldValue(gpu2.coreClockSpeedBoost) &&
    !hasProductFieldValue(gpu1.l1Cache) &&
    !hasProductFieldValue(gpu2.l1Cache) &&
    !hasProductFieldValue(gpu1.l2Cache) &&
    !hasProductFieldValue(gpu2.l2Cache) &&
    !hasProductFieldValue(gpu1.pixelFillRate) &&
    !hasProductFieldValue(gpu2.pixelFillRate) &&
    !hasProductFieldValue(gpu1.textureFillRate) &&
    !hasProductFieldValue(gpu2.textureFillRate) &&
    !hasProductFieldValue(gpu1.fp32Performance) &&
    !hasProductFieldValue(gpu2.fp32Performance) &&
    !hasProductFieldValue(gpu1.fp64Performance) &&
    !hasProductFieldValue(gpu2.fp64Performance)
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
