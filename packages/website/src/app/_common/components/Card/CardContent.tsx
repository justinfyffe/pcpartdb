import React from 'react';
import { classNames } from '../../utils/classNames';

export interface CardContentProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

export function CardContent(props: CardContentProps) {
  const Element = props.as || 'div';

  return (
    <Element className={classNames('flex flex-col gap-4', props.className)}>
      {props.children}
    </Element>
  );
}
