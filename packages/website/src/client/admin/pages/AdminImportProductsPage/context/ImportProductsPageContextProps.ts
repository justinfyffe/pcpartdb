import { Product, ProductDiff } from '@pcpartdb/shared';
import { createContext } from 'react';

export interface ImportProductsPageContextProps {
  productsToImport: Record<string, Product>;
  onImportSelection: (diff: ProductDiff, checked: boolean) => void;
}

export const ImportProductsPageContext =
  createContext<ImportProductsPageContextProps>({
    productsToImport: null,
    onImportSelection: null,
  });
