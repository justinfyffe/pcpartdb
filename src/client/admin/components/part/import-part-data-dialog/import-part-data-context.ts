import { Part } from '@shared/part';
import { createContext } from 'react';

export const ImportPartDataContext = createContext<Partial<Part>>({});
