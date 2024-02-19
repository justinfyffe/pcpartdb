import React from 'react';
import { classNames } from '../../utils/classNames';

interface FieldHintProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

export function FieldHint(props: FieldHintProps) {
  const Element = props.as || 'span';

  return (
    <Element
      className={classNames(
        'text-[#666] block text-xs leading-6 -mb-6',
        props.className,
      )}
    >
      {props.children}
    </Element>
  );
}
