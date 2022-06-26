import React, { FunctionComponent } from 'react';
import { classNames } from '../../ui/ui.utils';

interface FeedProps {
  as?: React.ElementType;
}

export const Feed: FunctionComponent<FeedProps> = (props) => {
  const Element = props.as || 'section';

  return <Element></Element>;
};
