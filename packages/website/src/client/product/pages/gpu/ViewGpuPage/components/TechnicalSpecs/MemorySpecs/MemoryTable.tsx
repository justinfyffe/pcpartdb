import { ProductType } from '@pcpartdb/shared';
import { ProductFieldRow } from 'packages/website/src/client/product/components/ProductFieldRow/ProductFieldRow';
import {
  Table,
  TBody,
} from 'packages/website/src/client/shared/components/Table/Table';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContext';

interface MemoryTableProps {
  className?: string;
}

export const MemoryTable: FunctionComponent<MemoryTableProps> = (props) => {
  const { className } = props;
  const { gpu } = useContext(ViewPageContext);

  return (
    <Table border responsive className={className}>
      <TBody>
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.memorySize]} />
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.memoryType]} />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.memoryBandwidth]}
        />
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.memoryClock]} />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.memoryInterface]}
        />
      </TBody>
    </Table>
  );
};
