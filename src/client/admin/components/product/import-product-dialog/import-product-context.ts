import { ImportProductResults } from '@shared/product';
import { createContext } from 'react';

export const ImportProductContext = createContext<ImportProductResults>({
  specs: {},
});
