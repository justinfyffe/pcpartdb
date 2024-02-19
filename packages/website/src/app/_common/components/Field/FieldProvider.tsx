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
  const fieldId = `field-id-${Math.floor(Math.random() * 99_999)}`;

  return (
    <FieldContext.Provider value={{ fieldId }}>
      {props.children}
    </FieldContext.Provider>
  );
}
