import React, { FunctionComponent } from 'react';
import { classNames } from '../../ui';

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

export const List: FunctionComponent<ListProps> = (props) => {
  const Element = props.as ?? 'ul';
  const direction = props.direction ?? 'vertical';

  return (
    <Element
      className={classNames(
        'flex flex-wrap gap-1',
        direction === 'vertical' ? 'flex-col' : 'flex-row',
        props.className,
      )}
    >
      {props.children}
    </Element>
  );
};

export const ListItem: FunctionComponent<ListItemProps> = (props) => {
  const Element = props.as || 'li';

  return (
    <Element className={classNames(props.className)}>{props.children}</Element>
  );
};
