import { createContext, useContext } from 'react';

export interface GonState {
  fieldCounter: number;
}

export const GonContext = createContext<GonState>({
  fieldCounter: 0,
});

export const useGon = () => {
  return useContext(GonContext);
};
