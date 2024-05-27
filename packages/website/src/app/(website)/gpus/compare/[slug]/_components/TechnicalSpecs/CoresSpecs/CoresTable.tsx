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
        {/*  */}
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[
            gpu1.fields?.streamProcessors,
            gpu2.fields?.streamProcessors,
          ]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.shadingUnits, gpu2.fields?.shadingUnits]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.cudaCores, gpu2.fields?.cudaCores]}
        />
        {/*  */}
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.computeUnits, gpu2.fields?.computeUnits]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.executionUnits, gpu2.fields?.executionUnits]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[
            gpu1.fields?.streamMultiprocessors,
            gpu2.fields?.streamMultiprocessors,
          ]}
        />
        {/*  */}
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
      </TBody>
    </Table>
  );
};
