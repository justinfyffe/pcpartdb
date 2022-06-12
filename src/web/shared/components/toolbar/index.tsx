import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

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
        props.className,
        'block bg-indigo-900 h-16 static text-gray-50',
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
        props.className,
        'flex font-medium items-center text-3xl',
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
        props.className,
        'font-medium rounded-none text-base',
      )}
    >
      {props.children}
    </Element>
  );
};
