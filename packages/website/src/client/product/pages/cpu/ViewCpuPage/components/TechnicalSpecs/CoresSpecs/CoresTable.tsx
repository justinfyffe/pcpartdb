import { ProductType } from '@pcpartdb/shared';
import { ProductFieldRow } from 'packages/website/src/client/product/components/ProductFieldRow/ProductFieldRow';
import React, { FunctionComponent, useContext } from 'react';
import { Table, TBody } from '../../../../../../../shared/components';
import { ViewPageContext } from '../../../context';

interface CoresTableProps {
  className?: string;
}

export const CoresTable: FunctionComponent<CoresTableProps> = (props) => {
  const { className } = props;

  const { cpu } = useContext(ViewPageContext);

  return (
    <Table border responsive className={className}>
      <TBody>
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.coresCount]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.threadsCount]} />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.performanceCoresCount]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.efficientCoresCount]}
        />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.clock]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.turboClock]} />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.performanceCoreClock]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.performanceCoreTurboClock]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.efficientCoreClock]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.efficientCoreTurboClock]}
        />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.baseClock]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.multiplier]} />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.isMultiplierUnlocked]}
        />
      </TBody>
    </Table>
  );
};
