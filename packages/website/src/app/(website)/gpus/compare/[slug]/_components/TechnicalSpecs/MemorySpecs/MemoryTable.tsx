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

interface MemoryTableProps {
  comparison: GpuProductComparison;
  className?: string;
}

export const MemoryTable: FunctionComponent<MemoryTableProps> = (props) => {
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
          fields={[gpu1.fields?.memorySize, gpu2.fields?.memorySize]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.memoryType, gpu2.fields?.memoryType]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.memoryBandwidth, gpu2.fields?.memoryBandwidth]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.memoryClock, gpu2.fields?.memoryClock]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.memoryInterface, gpu2.fields?.memoryInterface]}
        />
      </TBody>
    </Table>
  );
};
