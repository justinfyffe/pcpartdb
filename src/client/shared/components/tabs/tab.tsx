import { classNames } from '@client/shared/ui';
import React, { FunctionComponent } from 'react';

export interface TabProps {
  label?: string;

  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

export const Tab: FunctionComponent<TabProps> = (props) => {
  const Element = props.as || 'section';

  return (
    <Element className={classNames('', props.className)}>
      {props.children}
    </Element>
  );
};
