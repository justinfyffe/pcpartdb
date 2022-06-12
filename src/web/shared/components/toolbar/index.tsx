import React, { FunctionComponent } from 'react';
import { classNames } from '../../ui/ui.utils';

interface ToolbarProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

interface ToolbarTitleProps {
  element?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

interface ToolbarNavProps {
  element?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

export const Toolbar: FunctionComponent<ToolbarProps> = (props) => {
  const Element = props.as || 'header';

  return (
    <Element
      className={classNames(
        'block bg-indigo-900 h-16 static text-gray-50',
        props.className,
      )}
    >
      <div className="container flex h-full items-center justify-between px-4">
        {props.children}
      </div>
    </Element>
  );
};

export const ToolbarTitle: FunctionComponent<ToolbarTitleProps> = (props) => {
  const Element = props.element || 'div';

  return (
    <Element
      className={classNames(
        'flex font-medium items-center text-3xl',
        props.className,
      )}
    >
      {props.children}
    </Element>
  );
};

export const ToolbarNav: FunctionComponent<ToolbarNavProps> = (props) => {
  const Element = props.element || 'nav';

  return (
    <Element
      className={classNames(
        'font-medium rounded-none text-base',
        props.className,
      )}
    >
      {props.children}
    </Element>
  );
};
