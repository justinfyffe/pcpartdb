import { ProductType } from '@pcpartdb/shared';
import { ProductFieldRow } from 'packages/website/src/client/product/components';
import React, { FunctionComponent, useContext } from 'react';
import { Table, TBody } from '../../../../../../../shared/components';
import { ViewPageContext } from '../../../context';

interface CoresTableProps {
  className?: string;
}

export const CoresTable: FunctionComponent<CoresTableProps> = (props) => {
  const { className } = props;
  const { gpu } = useContext(ViewPageContext);

  return (
    <Table border responsive className={className}>
      <TBody>
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.shaderUnitsCudaCores]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.computeUnitsSmCount]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.textureMappingUnits]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.renderOutputUnits]}
        />
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.tensorCores]} />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.rayTracingCores]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.coreClockSpeedBase]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.coreClockSpeedBoost]}
        />
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.l1Cache]} />
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.l2Cache]} />
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.pixelFillRate]} />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.textureFillRate]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.fp32Performance]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.fp64Performance]}
        />
      </TBody>
    </Table>
  );
};
