import { Gpu, GpuDiff } from '@pcpartdb/shared';
import { createContext } from 'react';

export interface ImportGpusPageContextProps {
  gpusToImport: Record<string, Gpu>;
  onImportSelection: (diff: GpuDiff, checked: boolean) => void;
}

export const ImportGpusPageContext = createContext<ImportGpusPageContextProps>({
  gpusToImport: null,
  onImportSelection: null,
});
