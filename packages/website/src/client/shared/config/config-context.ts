import { Config } from '@pcpartdb/shared';
import { createContext, useContext } from 'react';

export interface ConfigContextState {
  config: Config;
}

export const ConfigContext = createContext<ConfigContextState>({
  config: {},
});

export const useConfig = () => {
  return useContext(ConfigContext);
};
