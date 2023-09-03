import { formatCpuName, ProductType } from '@pcpartdb/shared';
import { ProductFieldRow } from 'packages/website/src/client/product';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import {
  Table,
  TBody,
  Th,
  THead,
  Tr,
} from '../../../../../../../shared/components';
import { ComparePageContext } from '../../../context';

interface ArchitectureTableProps {
  className?: string;
}

export const ArchitectureTable: FunctionComponent<ArchitectureTableProps> = (
  props,
) => {
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
          fields={[cpu1.architecture, cpu2.architecture]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.codename, cpu2.codename]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.generation, cpu2.generation]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.memorySupport, cpu2.memorySupport]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.memoryChannels, cpu2.memoryChannels]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.hasEccMemory, cpu2.hasEccMemory]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.pciExpress, cpu2.pciExpress]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.chipsets, cpu2.chipsets]}
        />
      </TBody>
    </Table>
  );
};
