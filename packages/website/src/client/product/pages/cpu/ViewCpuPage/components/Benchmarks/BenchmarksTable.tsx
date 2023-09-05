import { ProductType } from '@pcpartdb/shared';
import { ProductFieldRow } from 'packages/website/src/client/product/components/ProductFieldRow/ProductFieldRow';
import React, { FunctionComponent, useContext } from 'react';
import { Table, TBody } from '../../../../../../shared/components';
import { ViewPageContext } from '../../context';

interface BenchmarksTableProps {
  className?: string;
}

export const BenchmarksTable: FunctionComponent<BenchmarksTableProps> = (
  props,
) => {
  const { className } = props;

  const { cpu } = useContext(ViewPageContext);

  return (
    <Table border responsive className={className}>
      <TBody>
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.cpuMarkMultiThread]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.cpuMarkSingleThread]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.geekbenchMultiCore]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.geekbenchSingleCore]}
        />
      </TBody>
    </Table>
  );
};
