import React, { FunctionComponent } from 'react';
import { classNames } from '../../utils/classNames';

interface ToolbarProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

export const Toolbar: FunctionComponent<ToolbarProps> = (props) => {
  const Element = props.as || 'nav';

  return (
    <Element
      className={classNames(
        'container block static',
        'bg-main-brand text-default text-base p-2',
        'flex gap-2 items-center',
        props.className,
      )}
    >
      {props.children}
    </Element>
  );
};
