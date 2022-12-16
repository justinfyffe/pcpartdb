import { createContext, useContext } from 'react';

export interface Gon {
  fieldCounter: number;
}

export const GonContext = createContext<Gon>({ fieldCounter: 0 });

export const useGon = () => {
  return useContext(GonContext);
};
