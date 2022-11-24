import { classNames } from '@client/shared/ui';
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
        'flex flex-wrap justify-center mx-[-16px]',
        props.className,
      )}
    >
      {props.children}
    </Element>
  );
};
