import { DataUpdate, DataUpdateStatus } from '@pcpartdb/shared';
import { createContext } from 'react';

export interface DataUpdatesPageContextProps {
  status?: DataUpdateStatus;
  updates: DataUpdate[];
  setUpdates: (updates: DataUpdate[]) => void;
}

export const DataUpdatesPageContext =
  createContext<DataUpdatesPageContextProps>({
    status: null,
    updates: null,
    setUpdates: null,
  });
