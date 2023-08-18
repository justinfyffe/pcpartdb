import { AutomationStatus } from '@pcpartdb/shared';
import { createContext } from 'react';

export interface AutomationStatusContextProps {
  status: AutomationStatus;
  refreshStatus: () => void | Promise<void>;
}

export const AutomationStatusContext =
  createContext<AutomationStatusContextProps>({
    status: null,
    refreshStatus: null,
  });
