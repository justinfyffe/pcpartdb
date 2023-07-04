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

interface PhysicalTableProps {
  className?: string;
}

export const PhysicalTable: FunctionComponent<PhysicalTableProps> = (props) => {
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
          fields={[cpu1.socket, cpu2.socket]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.foundry, cpu2.foundry]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.processSize, cpu2.processSize]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.transistors, cpu2.transistors]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.tCaseMax, cpu2.tCaseMax]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.tjMax, cpu2.tjMax]}
        />
      </TBody>
    </Table>
  );
};
