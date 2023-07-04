import { ProductDiff, ProductType } from '@pcpartdb/shared';
import {
  Button,
  ButtonVariant,
} from 'packages/website/src/client/shared/components';
import React, { FunctionComponent, useState } from 'react';
import { FormattedDiffTab } from './FormattedDiffTab';
import { RawDiffTab } from './RawDiffTab';
import { ProductDiffKey } from './types';

enum Tab {
  Formatted,
  Raw,
}

interface ProductDiffViewProps {
  productType: ProductType;
  dataToPreview: ProductDiffKey[];
  diff: ProductDiff;
}

export const ProductDiffDialog: FunctionComponent<ProductDiffViewProps> = (
  props,
) => {
  const { productType, dataToPreview, diff } = props;
  const [tab, setTab] = useState(Tab.Formatted);

  return (
    <div className="bg-white flex flex-col gap-4 h-[80%] w-[80%] p-4 overflow-auto max-w-247 rounded shadow">
      <div className="flex flex-col gap-4 max-h-full">
        <div className="flex gap-4">
          <Button
            className="flex-1"
            variant={
              tab === Tab.Formatted
                ? ButtonVariant.Primary
                : ButtonVariant.Generic
            }
            onClick={() => setTab(Tab.Formatted)}
          >
            Formatted Diff
          </Button>
          <Button
            className="flex-1"
            variant={
              tab === Tab.Raw ? ButtonVariant.Primary : ButtonVariant.Generic
            }
            onClick={() => setTab(Tab.Raw)}
          >
            Raw Diff
          </Button>
        </div>

        <div className="overflow-auto flex-1">
          {tab === Tab.Formatted ? (
            <FormattedDiffTab
              productType={productType}
              dataToPreview={dataToPreview}
              diff={diff}
            />
          ) : (
            <></>
          )}
          {tab === Tab.Raw ? <RawDiffTab diff={diff} /> : <></>}
        </div>
      </div>
    </div>
  );
};
