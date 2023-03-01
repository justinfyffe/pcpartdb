import React, { FunctionComponent } from 'react';
import { classNames } from '../../ui';

interface ToolbarProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

interface ToolbarTitleProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

interface ToolbarNavProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

export const Toolbar: FunctionComponent<ToolbarProps> = (props) => {
  const Element = props.as || 'header';

  return (
    <Element
      className={classNames(
        'bg-toolbar block static text-toolbar',
        props.className,
      )}
    >
      <div
        className={classNames(
          'container flex h-16 items-center justify-between px-4',
        )}
      >
        {props.children}
      </div>
    </Element>
  );
};

export const ToolbarTitle: FunctionComponent<ToolbarTitleProps> = (props) => {
  const Element = props.as || 'div';

  return (
    <Element
      className={classNames(
        'flex font-medium gap-2 items-center text-3xl md:text-2xl sm:text-xl',
        props.className,
      )}
    >
      {props.children}
    </Element>
  );
};

export const ToolbarNav: FunctionComponent<ToolbarNavProps> = (props) => {
  const Element = props.as || 'nav';

  return (
    <Element
      className={classNames(
        'flex items-center font-medium rounded-none text-sm',
        props.className,
      )}
    >
      {props.children}
    </Element>
  );
};
