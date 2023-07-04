import { ProductType } from '@pcpartdb/shared';
import { ProductFieldRow } from 'packages/website/src/client/product/components';
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
  const { gpu } = useContext(ViewPageContext);

  return (
    <Table border responsive className={className}>
      <TBody>
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.g3dMark]} />
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.g2dMark]} />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.timespyGraphics]}
        />
      </TBody>
    </Table>
  );
};
