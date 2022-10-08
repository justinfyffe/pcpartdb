import React, { FunctionComponent } from 'react';

export const AutocompleteOption: FunctionComponent<AutocompleteOptionProps> = (
  props,
) => {
  const { children } = props;

  return <>{children}</>;
};

export interface AutocompleteOptionProps {
  label: string;
  value: string;
  children?: React.ReactNode;

  className?: string;
  hoveredClassName?: string;
}
