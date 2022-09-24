import React, { FunctionComponent } from 'react';

export const SelectOption: FunctionComponent<SelectOptionProps> = (props) => {
  const { children } = props;
  return <>{children}</>;
};

export interface SelectOptionProps {
  label: string;
  value: string;

  children?: React.ReactNode;
}
