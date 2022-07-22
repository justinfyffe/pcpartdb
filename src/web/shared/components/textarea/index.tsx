import React, { FunctionComponent, HTMLProps } from 'react';
import { classNames } from '../../ui/ui.utils';

interface TextareaProps extends HTMLProps<HTMLTextAreaElement> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  innerRef?: any;
}

export const Textarea: FunctionComponent<TextareaProps> = (props) => {
  const { children, className, ...htmlProps } = props;

  return (
    <textarea
      {...htmlProps}
      className={classNames(
        'border m-0 p-3 rounded text-sm w-full shadow',
        className,
      )}
    >
      {children}
    </textarea>
  );
};
