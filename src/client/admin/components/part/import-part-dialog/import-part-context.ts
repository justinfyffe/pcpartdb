import { ImportPartResults } from '@shared/part';
import { createContext } from 'react';

export const ImportPartContext = createContext<ImportPartResults>({
  specs: {},
});
