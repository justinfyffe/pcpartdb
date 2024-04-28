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

interface CompatibilityTableProps {
  comparison: GpuProductComparison;
  className?: string;
}

export const CompatibilityTable: FunctionComponent<CompatibilityTableProps> = (
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
          fields={[gpu1.fields?.slotWidth, gpu2.fields?.slotWidth]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.busInterface, gpu2.fields?.busInterface]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.tdp, gpu2.fields?.tdp]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.suggestedPsu, gpu2.fields?.suggestedPsu]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.powerConnectors, gpu2.fields?.powerConnectors]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.fields?.outputs, gpu2.fields?.outputs]}
        />
      </TBody>
    </Table>
  );
};
