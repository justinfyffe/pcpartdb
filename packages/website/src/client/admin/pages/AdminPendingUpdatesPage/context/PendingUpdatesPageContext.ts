import { DataUpdate } from '@pcpartdb/shared';
import { createContext } from 'react';

export interface PendingUpdatesPageContextProps {
  pendingUpdates: DataUpdate[];
  setPendingUpdates: (pendingUpdates: DataUpdate[]) => void;
}

export const PendingUpdatesPageContext =
  createContext<PendingUpdatesPageContextProps>({
    pendingUpdates: null,
    setPendingUpdates: null,
  });
