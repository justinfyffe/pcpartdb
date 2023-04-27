import { Gpu, GpuDiff } from '@pcpartdb/shared';
import { ImportGpusPageContextProps } from '../context';

export function useImportGpusPageContextProps(input: {
  gpusToImport: Record<string, Gpu>;
  onImportSelection: (diff: GpuDiff, checked: boolean) => void;
}) {
  return {
    ...input,
  } as ImportGpusPageContextProps;
}
