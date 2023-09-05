import 'reflect-metadata';
import { ProductDiff, ProductType } from '@pcpartdb/shared';
import {
  Table,
  TBody,
} from 'packages/website/src/client/shared/components/Table/Table';
import React from 'react';
import { ImportProductRow } from './ImportProductRow';

interface ImportProductsTableProps {
  productType: ProductType;
  diffs: ProductDiff[];
}

export const ImportProductsTable = (props: ImportProductsTableProps) => {
  const { productType, diffs } = props;

  return (
    <Table>
      <TBody>
        {diffs.map((diff) => (
          <ImportProductRow
            key={diff.updated.slug}
            productType={productType}
            diff={diff}
          />
        ))}
      </TBody>
    </Table>
  );
};
