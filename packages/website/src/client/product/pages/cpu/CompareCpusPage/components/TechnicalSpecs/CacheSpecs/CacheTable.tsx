import { ProductType } from '@pcpartdb/shared';
import {
  formatCpuName,
  ProductFieldRow,
} from 'packages/website/src/client/product';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import {
  Table,
  TBody,
  Th,
  THead,
  Tr,
} from '../../../../../../../shared/components';
import { ComparePageContext } from '../../../context';

interface CacheTableProps {
  className?: string;
}

export const CacheTable: FunctionComponent<CacheTableProps> = (props) => {
  const { className } = props;

  const { comparison } = useContext(ComparePageContext);
  const [cpu1, cpu2] = comparison;

  const [name1, name2] = useMemo(() => {
    return [
      formatCpuName(cpu1, { company: false }),
      formatCpuName(cpu2, { company: false }),
    ];
  }, [cpu1, cpu2]);

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
          type={ProductType.Cpu}
          fields={[cpu1.l1Cache, cpu2.l1Cache]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.l2Cache, cpu2.l2Cache]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.l3Cache, cpu2.l3Cache]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.efficientCoreL1Cache, cpu2.efficientCoreL1Cache]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.efficientCoreL2Cache, cpu2.efficientCoreL2Cache]}
        />
      </TBody>
    </Table>
  );
};
