import React from 'react';
import { classNames } from '../../utils/classNames';

interface FieldErrorProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

export function FieldError(props: FieldErrorProps) {
  const Element = props.as || 'div';

  return (
    <Element
      className={classNames(
        'text-[#f00] block text-2xs leading-6 -mb-6',
        props.className,
      )}
    >
      {props.children}
    </Element>
  );
}
