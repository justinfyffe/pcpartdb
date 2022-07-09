import React, { FunctionComponent, HTMLProps } from 'react';

interface CheckboxProps extends HTMLProps<HTMLInputElement> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  innerRef?: any;
}

export const Checkbox: FunctionComponent<CheckboxProps> = (props) => {
  const { children, innerRef, ...htmlProps } = props;

  return (
    <label>
      <input {...htmlProps} type="checkbox" ref={innerRef} />
      {children}
    </label>
  );
};
