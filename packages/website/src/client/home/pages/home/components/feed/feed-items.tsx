import { classNames } from '@pcpartdb/website/client/shared/ui';
import React, { FunctionComponent } from 'react';

interface FeedItemsProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

export const FeedItems: FunctionComponent<FeedItemsProps> = (props) => {
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
};
