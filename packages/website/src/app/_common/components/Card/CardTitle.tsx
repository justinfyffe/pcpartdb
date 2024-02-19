import React from 'react';
import { classNames } from '../../utils/classNames';

export interface CardTitleProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

export function CardTitle(props: CardTitleProps) {
  const Element = props.as || 'h3';

  return (
    <Element
      className={classNames(
        'font-medium text-xl text-content mb-0',
        props.className,
      )}
    >
      {props.children}
    </Element>
  );
}
