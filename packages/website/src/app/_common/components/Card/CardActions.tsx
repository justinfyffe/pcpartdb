import React from 'react';
import { classNames } from '../../utils/classNames';

export interface CardActionsProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

export function CardActions(props: CardActionsProps) {
  const Element = props.as || 'div';

  return (
    <Element className={classNames('flex justify-end', props.className)}>
      {props.children}
    </Element>
  );
}
