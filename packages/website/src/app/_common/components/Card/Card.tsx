import React, { FunctionComponent } from 'react';
import { classNames } from '../../utils/classNames';

export interface CardProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

export const Card: FunctionComponent<CardProps> = (props) => {
  const Element = props.as || 'div';

  return (
    <Element
      className={classNames(
        'flex flex-col gap-4 items-stretch justify-start',
        'p-4',
        'bg-light-shades',
        'rounded shadow border-px',
        props.className,
      )}
    >
      {props.children}
    </Element>
  );
};
