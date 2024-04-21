import { Product, ProductType } from '@pcpartdb/shared';
import { createContext, useMemo, useState } from 'react';

export interface ProductFormContextState {
  productType: ProductType;
  product?: Partial<Product>;
  parentProduct?: Partial<Product>;
  updateContext?: (ctx: ProductFormContextState) => void;
}

export const ProductFormContext = createContext<ProductFormContextState>({
  productType: null,
  product: null,
  parentProduct: null,
  updateContext: null,
});

export function useProductFormContextBuilder(
  initial: () => ProductFormContextState,
) {
  const [contextImpl, updateContext] =
    useState<ProductFormContextState>(initial);
  const context = useMemo(
    () => ({ ...contextImpl, updateContext }),
    [contextImpl],
  );
  return context;
}
