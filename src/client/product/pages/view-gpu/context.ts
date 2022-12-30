import { Product } from '@shared/product';
import { createContext } from 'react';
import { ViewPageContentData } from './types';

interface ViewPageContextState {
  product: Product;
  contentData: ViewPageContentData;
}

export const ViewPageContext = createContext<ViewPageContextState>({
  product: null,
  contentData: null,
});

export function createViewPageContextState(input: {
  product: Product;
  contentData: ViewPageContentData;
}) {
  const product = { ...input.product };
  const contentData = { ...input.contentData };

  return { product, contentData } as ViewPageContextState;
}
