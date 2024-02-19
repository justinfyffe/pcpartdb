import React from 'react';
import { classNames } from '../../../../_common/utils/classNames';

interface FeedItemsProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

export function FeedItems(props: FeedItemsProps) {
  const Element = props.as || 'div';

  return (
    <Element
      className={classNames(
        'flex flex-wrap justify-center -mx-4',
        props.className,
      )}
    >
      {props.children}
    </Element>
  );
}
