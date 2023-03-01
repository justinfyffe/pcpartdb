import { createContext, useContext } from 'react';

export interface LayoutContextState {
  fieldCounter: number;
}

export const LayoutContext = createContext<LayoutContextState>({
  fieldCounter: 0,
});

export const useLayout = () => {
  return useContext(LayoutContext);
};
