import { ProductType } from '@pcpartdb/shared';
import { ProductFieldRow } from 'packages/website/src/client/product/components/ProductFieldRow/ProductFieldRow';
import {
  Table,
  TBody,
} from 'packages/website/src/client/shared/components/Table/Table';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context';

interface ApiTableProps {
  className?: string;
}

export const ApiTable: FunctionComponent<ApiTableProps> = (props) => {
  const { className } = props;
  const { gpu } = useContext(ViewPageContext);

  return (
    <Table border responsive className={className}>
      <TBody>
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.directxVersion]} />
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.openClVersion]} />
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.openGlVersion]} />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.shaderModelVersion]}
        />
      </TBody>
    </Table>
  );
};
