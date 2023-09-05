import { ProductDiff, ProductType } from '@pcpartdb/shared';
import {
  Table,
  TBody,
  Th,
  THead,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import React, { FunctionComponent } from 'react';
import { FormattedDiffRow } from './FormattedDiffRow';
import { ProductDiffKey } from './types';

interface FormattedDiffTabProps {
  productType: ProductType;
  dataToPreview: ProductDiffKey[];
  diff: ProductDiff;
}

export const FormattedDiffTab: FunctionComponent<FormattedDiffTabProps> = (
  props,
) => {
  const { productType, dataToPreview, diff } = props;

  return (
    <div className="bg-white flex flex-col overflow-auto">
      <Table responsive border>
        <THead>
          <Tr sticky>
            <Th className="w-[30%] font-bold">Field</Th>
            <Th className="w-[35%] font-bold">Before</Th>
            <Th className="w-[35%] font-bold">After</Th>
          </Tr>
        </THead>
        <TBody>
          {dataToPreview.map((previewKey) => (
            <FormattedDiffRow
              key={previewKey}
              productType={productType}
              diffFieldKey={previewKey}
              diff={diff}
            />
          ))}
        </TBody>
      </Table>
    </div>
  );
};
