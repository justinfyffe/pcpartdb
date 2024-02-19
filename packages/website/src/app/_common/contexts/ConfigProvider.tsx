'use client';

import { Config } from '@pcpartdb/shared';
import React, { createContext, useContext } from 'react';

export interface ConfigContextState {
  config: Config;
}

export const ConfigContext = createContext<ConfigContextState>({
  config: {},
});

export function useConfig() {
  return useContext(ConfigContext);
}

export interface ConfigProviderProps {
  config: Config;
  children: React.ReactNode;
}

export function ConfigProvider(props: ConfigProviderProps) {
  return (
    <ConfigContext.Provider value={{ config: props.config }}>
      {props.children}
    </ConfigContext.Provider>
  );
}
