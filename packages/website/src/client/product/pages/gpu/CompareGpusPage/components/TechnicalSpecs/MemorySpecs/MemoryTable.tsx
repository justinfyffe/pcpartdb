import { formatProductName, ProductType } from '@pcpartdb/shared';
import { ProductFieldRow } from 'packages/website/src/client/product/components/ProductFieldRow/ProductFieldRow';
import {
  Table,
  TBody,
  Th,
  THead,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContextProvider';

interface MemoryTableProps {
  className?: string;
}

export const MemoryTable: FunctionComponent<MemoryTableProps> = (props) => {
  const { className } = props;

  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  const [name1, name2] = useMemo(() => {
    return [
      formatProductName(gpu1, { company: false }),
      formatProductName(gpu2, { company: false }),
    ];
  }, [gpu1, gpu2]);

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
