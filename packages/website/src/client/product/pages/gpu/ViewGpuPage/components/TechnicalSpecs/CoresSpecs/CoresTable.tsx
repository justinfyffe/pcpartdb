import { ProductType } from '@pcpartdb/shared';
import { ProductFieldRow } from 'packages/website/src/client/product/components/ProductFieldRow/ProductFieldRow';
import {
  Table,
  TBody,
  Th,
  THead,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContext';

interface CoresTableProps {
  className?: string;
}

export const CoresTable: FunctionComponent<CoresTableProps> = (props) => {
  const { className } = props;
  const { gpu } = useContext(ViewPageContext);

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th>Spec</Th>
          <Th>Value</Th>
        </Tr>
      </THead>
      <TBody>
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.fields?.gpuCores]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.fields?.computeUnits]}
        />
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.fields?.tmus]} />
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.fields?.rops]} />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.fields?.tensorCores]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.fields?.rtCores]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.fields?.gpuCoreBaseClock]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.fields?.gpuCoreBoostClock]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.fields?.l1Cache]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.fields?.l2Cache]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.fields?.pixelRate]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.fields?.textureRate]}
        />
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.fields?.fp32]} />
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.fields?.fp64]} />
      </TBody>
    </Table>
  );
};
