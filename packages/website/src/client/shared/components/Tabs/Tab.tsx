import React, { FunctionComponent } from 'react';
import { classNames } from '../../ui';

export interface TabProps {
  label?: string;

  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

export const Tab: FunctionComponent<TabProps> = (props) => {
  const Element = props.as || 'section';

  return (
    <Element
      className={classNames('bg-light-shades p-4 rounded-b', props.className)}
    >
      {props.children}
    </Element>
  );
};
