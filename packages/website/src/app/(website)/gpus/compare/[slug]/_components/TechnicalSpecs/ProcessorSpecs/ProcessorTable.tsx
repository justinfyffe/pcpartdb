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

interface ProcessorTableProps {
  comparison: GpuProductComparison;
  className?: string;
}

export const ProcessorTable: FunctionComponent<ProcessorTableProps> = (
  props,
) => {
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
          fields={[gpu1.fields?.codename, gpu2.fields?.codename]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.architecture, gpu2.fields?.architecture]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.processSize, gpu2.fields?.processSize]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.transistors, gpu2.fields?.transistors]}
        />
      </TBody>
    </Table>
  );
};
