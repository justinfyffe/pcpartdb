import React from 'react';
import { classNames } from '../../utils/classNames';

interface FieldOptionalProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

export function FieldOptional(props: FieldOptionalProps) {
  const Element = props.as || 'span';

  return (
    <Element className={classNames('text-[#aaa] text-xs', props.className)}>
      {props.children}
    </Element>
  );
}
