import { Product, ProductDiff } from '@pcpartdb/shared';
import { ImportProductsPageContextProps } from '../context';

export function useImportProductsPageContextProps(input: {
  productsToImport: Record<string, Product>;
  onImportSelection: (diff: ProductDiff, checked: boolean) => void;
}) {
  return {
    ...input,
  } as ImportProductsPageContextProps;
}
