import { ProductType } from '@pcpartdb/shared';
import { ProductFieldRow } from 'packages/website/src/client/product/components/ProductFieldRow/ProductFieldRow';
import {
  Table,
  TBody,
  Th,
  THead,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContextProvider';

interface ApiTableProps {
  className?: string;
}

export const ApiTable: FunctionComponent<ApiTableProps> = (props) => {
  const { className } = props;
  const { gpu } = useContext(ViewPageContext);

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th>Spec</Th>
          <Th>Value</Th>
        </Tr>
      </THead>
      <TBody>
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.fields?.directxVersion]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.fields?.openClVersion]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.fields?.openGlVersion]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.fields?.shaderModelVersion]}
        />
      </TBody>
    </Table>
  );
};
