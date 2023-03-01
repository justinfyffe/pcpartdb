import { classNames } from '@pcpartdb/website/client/shared/ui';
import React, { FunctionComponent } from 'react';

interface FeedProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

export const Feed: FunctionComponent<FeedProps> = (props) => {
  const Element = props.as || 'section';

  return (
    <Element className={classNames(props.className)}>{props.children}</Element>
  );
};
