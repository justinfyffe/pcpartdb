import React from 'react';
import { classNames } from '../../../../_common/utils/classNames';

interface FeedProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

export function Feed(props: FeedProps) {
  const Element = props.as || 'section';

  return (
    <Element className={classNames(props.className)}>{props.children}</Element>
  );
}
