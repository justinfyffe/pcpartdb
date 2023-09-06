import { ProductType } from '@pcpartdb/shared';
import { ProductFieldRow } from 'packages/website/src/client/product/components/ProductFieldRow/ProductFieldRow';
import {
  Table,
  TBody,
} from 'packages/website/src/client/shared/components/Table/Table';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContext';

interface CacheTableProps {
  className?: string;
}

export const CacheTable: FunctionComponent<CacheTableProps> = (props) => {
  const { className } = props;

  const { cpu } = useContext(ViewPageContext);

  return (
    <Table border responsive className={className}>
      <TBody>
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.l1Cache]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.l2Cache]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.l3Cache]} />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.efficientCoreL1Cache]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.efficientCoreL2Cache]}
        />
      </TBody>
    </Table>
  );
};
