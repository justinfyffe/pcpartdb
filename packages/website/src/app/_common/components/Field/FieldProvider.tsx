'use client';

import React, { createContext } from 'react';

interface FieldState {
  fieldId: string;
}

export const FieldContext = createContext<FieldState>({
  fieldId: '',
});

export interface FieldProviderProps {
  fieldId: string;
  children: React.ReactNode;
}

export function FieldProvider(props: FieldProviderProps) {
  const fieldId = props.fieldId;

  return (
    <FieldContext.Provider value={{ fieldId }}>
      {props.children}
    </FieldContext.Provider>
  );
}
