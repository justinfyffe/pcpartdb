import 'reflect-metadata';
import {
  CpuDiff,
  formatProductName,
  GpuDiff,
  ProductDiff,
  ProductType,
} from '@pcpartdb/shared';
import {
  Checkbox,
  showDialog,
  Td,
  Tr,
} from 'packages/website/src/client/shared/components';
import React, { useCallback, useContext, useMemo } from 'react';
import { CpuDiffDialog } from '../../../../../components/cpu';
import { GpuDiffDialog } from '../../../../../components/gpu/GpuDiffDialog';
import { ImportProductsPageContext } from '../../context';

interface ImportProductRowProps {
  productType: ProductType;
  diff: ProductDiff;
}

export const ImportProductRow = (props: ImportProductRowProps) => {
  const { productType, diff } = props;
  const { productsToImport, onImportSelection } = useContext(
    ImportProductsPageContext,
  );

  const isSelected = useMemo(
    () => productsToImport[diff.updated.slug] != null,
    [diff.updated.slug, productsToImport],
  );

  const productName = useMemo(
    () => formatProductName(productType, diff.updated),
    [productType, diff.updated],
  );

  const handlePreviewProduct = useCallback(() => {
    if (productType === ProductType.Cpu) {
      showDialog(<CpuDiffDialog diff={diff as CpuDiff} />);
    } else if (productType === ProductType.Gpu) {
      showDialog(<GpuDiffDialog diff={diff as GpuDiff} />);
    } else {
      throw new Error(
        `Missing preview product diff support for ${productType}`,
      );
    }
  }, [productType, diff]);

  const handleImportCheck = useCallback(
    (checked: boolean) => {
      onImportSelection(diff, checked);
    },
    [diff, onImportSelection],
  );

  return (
    <Tr>
      <Td>
        <a onClick={() => handlePreviewProduct()} className="cursor-pointer">
          {productName}
        </a>
      </Td>
      <Td className="text-right">
        <Checkbox value={isSelected} onChange={handleImportCheck} />
      </Td>
    </Tr>
  );
};
