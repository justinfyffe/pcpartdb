import { DataUpdate, DataUpdateStatus } from '@pcpartdb/shared';
import { DataUpdatesPageContextProps } from '../context';

export function useDataUpdatesPageContextProps(input: {
  status?: DataUpdateStatus;
  updates: DataUpdate[];
  setUpdates: (updates: DataUpdate[]) => void;
}) {
  return {
    ...input,
  } as DataUpdatesPageContextProps;
}
