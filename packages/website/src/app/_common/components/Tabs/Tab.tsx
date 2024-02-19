import React from 'react';
import { classNames } from '../../utils/classNames';

export interface TabProps {
  label?: string;

  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

export function Tab(props: TabProps) {
  const Element = props.as || 'section';

  return (
    <Element className={classNames('h-full', props.className)}>
      {props.children}
    </Element>
  );
}
