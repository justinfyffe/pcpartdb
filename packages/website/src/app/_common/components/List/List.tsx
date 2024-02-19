import React from 'react';
import { classNames } from '../../utils/classNames';

interface ListProps {
  as?: React.ElementType;
  className?: string;
  direction?: 'vertical' | 'horizontal';

  children?: React.ReactNode;
}

interface ListItemProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

export function List(props: ListProps) {
  const Element = props.as ?? 'ul';
  const direction = props.direction ?? 'vertical';

  return (
    <Element
      className={classNames(
        'flex flex-wrap gap-2',
        direction === 'vertical' ? 'flex-col' : 'flex-row',
        props.className,
      )}
    >
      {props.children}
    </Element>
  );
}

export function ListItem(props: ListItemProps) {
  const Element = props.as || 'li';

  return (
    <Element className={classNames(props.className)}>{props.children}</Element>
  );
}
