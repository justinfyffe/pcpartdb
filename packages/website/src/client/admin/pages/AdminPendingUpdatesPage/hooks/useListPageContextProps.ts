import { DataUpdate } from '@pcpartdb/shared';
import { PendingUpdatesPageContextProps } from '../context';

export function usePendingUpdatesPageContextProps(input: {
  pendingUpdates: DataUpdate[];
  setPendingUpdates: (updates: DataUpdate[]) => void;
}) {
  return {
    ...input,
  } as PendingUpdatesPageContextProps;
}
