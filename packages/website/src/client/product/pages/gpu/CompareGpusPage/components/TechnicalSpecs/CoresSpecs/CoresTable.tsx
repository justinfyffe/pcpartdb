import { formatGpuName, ProductType } from '@pcpartdb/shared';
import { ProductFieldRow } from 'packages/website/src/client/product/components/ProductFieldRow/ProductFieldRow';
import {
  Table,
  TBody,
  Th,
  THead,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContext';

interface CoresTableProps {
  className?: string;
}

export const CoresTable: FunctionComponent<CoresTableProps> = (props) => {
  const { className } = props;

  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  const [name1, name2] = useMemo(() => {
    return [
      formatGpuName(gpu1, { company: false }),
      formatGpuName(gpu2, { company: false }),
    ];
  }, [gpu1, gpu2]);

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th></Th>
          <Th>{name1}</Th>
          <Th>{name2}</Th>
        </Tr>
      </THead>
      <TBody>
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.shaderUnitsCudaCores, gpu2.shaderUnitsCudaCores]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.computeUnitsSmCount, gpu2.computeUnitsSmCount]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.textureMappingUnits, gpu2.textureMappingUnits]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.renderOutputUnits, gpu2.renderOutputUnits]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.tensorCores, gpu2.tensorCores]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.rayTracingCores, gpu2.rayTracingCores]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.coreClockSpeedBase, gpu2.coreClockSpeedBase]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.coreClockSpeedBoost, gpu2.coreClockSpeedBoost]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.l1Cache, gpu2.l1Cache]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.l2Cache, gpu2.l2Cache]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.pixelFillRate, gpu2.pixelFillRate]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.textureFillRate, gpu2.textureFillRate]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fp32Performance, gpu2.fp32Performance]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fp64Performance, gpu2.fp64Performance]}
        />
      </TBody>
    </Table>
  );
};
