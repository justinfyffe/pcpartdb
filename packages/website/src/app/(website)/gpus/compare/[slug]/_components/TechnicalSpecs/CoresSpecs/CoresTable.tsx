import {
  formatProductName,
  GpuProductComparison,
  ProductType,
} from '@pcpartdb/shared';
import { Table } from 'packages/website/src/app/_common/components/Table/Table';
import { TBody } from 'packages/website/src/app/_common/components/Table/TBody';
import { Th } from 'packages/website/src/app/_common/components/Table/Th';
import { THead } from 'packages/website/src/app/_common/components/Table/THead';
import { Tr } from 'packages/website/src/app/_common/components/Table/Tr';
import { ProductFieldRow } from 'packages/website/src/app/_common/product/components/ProductFieldRow/ProductFieldRow';
import React, { FunctionComponent } from 'react';

interface CoresTableProps {
  comparison: GpuProductComparison;
  className?: string;
}

export const CoresTable: FunctionComponent<CoresTableProps> = (props) => {
  const { comparison, className } = props;

  const [gpu1, gpu2] = comparison;

  const [name1, name2] = [
    formatProductName(gpu1, { company: false }),
    formatProductName(gpu2, { company: false }),
  ];

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th>Spec</Th>
          <Th>{name1}</Th>
          <Th>{name2}</Th>
        </Tr>
      </THead>
      <TBody>
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.gpuCores, gpu2.fields?.gpuCores]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.computeUnits, gpu2.fields?.computeUnits]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.tmus, gpu2.fields?.tmus]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.rops, gpu2.fields?.rops]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.tensorCores, gpu2.fields?.tensorCores]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.rtCores, gpu2.fields?.rtCores]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[
            gpu1.fields?.gpuCoreBaseClock,
            gpu2.fields?.gpuCoreBaseClock,
          ]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[
            gpu1.fields?.gpuCoreBoostClock,
            gpu2.fields?.gpuCoreBoostClock,
          ]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.l1Cache, gpu2.fields?.l1Cache]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.l2Cache, gpu2.fields?.l2Cache]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.pixelRate, gpu2.fields?.pixelRate]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.textureRate, gpu2.fields?.textureRate]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.fp32, gpu2.fields?.fp32]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.fp64, gpu2.fields?.fp64]}
        />
      </TBody>
    </Table>
  );
};
