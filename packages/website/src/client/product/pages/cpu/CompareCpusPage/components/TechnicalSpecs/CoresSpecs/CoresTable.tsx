import { formatCpuName, ProductType } from '@pcpartdb/shared';
import { ProductFieldRow } from 'packages/website/src/client/product/components/ProductFieldRow/ProductFieldRow';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import {
  Table,
  TBody,
  Th,
  THead,
  Tr,
} from '../../../../../../../shared/components';
import { ComparePageContext } from '../../../context';

interface CoresTableProps {
  className?: string;
}

export const CoresTable: FunctionComponent<CoresTableProps> = (props) => {
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
          fields={[cpu1.coresCount, cpu2.coresCount]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.threadsCount, cpu2.threadsCount]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.performanceCoresCount, cpu2.performanceCoresCount]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.efficientCoresCount, cpu2.efficientCoresCount]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.clock, cpu2.clock]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.turboClock, cpu2.turboClock]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.performanceCoreClock, cpu2.performanceCoreClock]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[
            cpu1.performanceCoreTurboClock,
            cpu2.performanceCoreTurboClock,
          ]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.efficientCoreClock, cpu2.efficientCoreClock]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.efficientCoreTurboClock, cpu2.efficientCoreTurboClock]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.baseClock, cpu2.baseClock]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.multiplier, cpu2.multiplier]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.isMultiplierUnlocked, cpu2.isMultiplierUnlocked]}
        />
      </TBody>
    </Table>
  );
};
