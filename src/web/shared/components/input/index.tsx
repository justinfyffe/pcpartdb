import React, { FunctionComponent, HTMLProps } from 'react';
import { classNames } from '../../ui/ui.utils';

interface InputProps extends HTMLProps<HTMLInputElement> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  innerRef?: any;
}

export const Input: FunctionComponent<InputProps> = (props) => {
  const { className, innerRef, ...htmlProps } = props;

  return (
    <input
      {...htmlProps}
      type={props.type ?? 'text'}
      className={classNames(
        className,
        'border flex items-center m-0 p-3 rounded text-sm w-full',
      )}
      ref={innerRef}
    />
  );
};
