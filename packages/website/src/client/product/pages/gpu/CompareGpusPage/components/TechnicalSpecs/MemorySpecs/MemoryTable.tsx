import { formatGpuName, ProductType } from '@pcpartdb/shared';
import { ProductFieldRow } from 'packages/website/src/client/product/components';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import {
  Table,
  TBody,
  Th,
  THead,
  Tr,
} from '../../../../../../../shared/components';
import { ComparePageContext } from '../../../context';

interface MemoryTableProps {
  className?: string;
}

export const MemoryTable: FunctionComponent<MemoryTableProps> = (props) => {
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
          fields={[gpu1.memorySize, gpu2.memorySize]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.memoryType, gpu2.memoryType]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.memoryBandwidth, gpu2.memoryBandwidth]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.memoryClock, gpu2.memoryClock]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu1.memoryInterface, gpu2.memoryInterface]}
        />
      </TBody>
    </Table>
  );
};
