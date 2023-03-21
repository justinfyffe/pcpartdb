import { CompareGpusContentData, GpuComparison } from '@pcpartdb/shared';
import { createContext } from 'react';

export interface ComparePageContextProps {
  comparison: GpuComparison;
  contentData: CompareGpusContentData;
}

export const ComparePageContext = createContext<ComparePageContextProps>({
  comparison: null,
  contentData: null,
});
