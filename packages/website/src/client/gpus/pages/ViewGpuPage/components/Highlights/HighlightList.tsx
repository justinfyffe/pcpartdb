import React, { cloneElement } from 'react';
import {
  Button,
  ButtonProps,
  ButtonVariant,
} from '../../../../../shared/components';
import { classNames } from '../../../../../shared/ui';

interface HighlightListProps {
  children?: React.ReactNode;

  className?: string;
}

export const HighlightList = (props: HighlightListProps) => {
  const { children, className } = props;
  return (
    <ul
      className={classNames(
        'grid grid-cols-2 lg:flex flex-col md:gap-3 gap-4',
        className,
      )}
    >
      {children}
    </ul>
  );
};

interface HighlightListItemProps {
  children?: React.ReactNode;
}

export const HighlightListItem = (props: HighlightListItemProps) => {
  const { children } = props;

  return (
    <li className="bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow">
      {children}
    </li>
  );
};

interface HighlightLabelProps {
  icon?: React.ReactElement;

  children?: React.ReactNode;
}

export const HighlightLabel = (props: HighlightLabelProps) => {
  const { icon, children } = props;

  return (
    <div className="flex-1 flex gap-2 items-center">
      <div className="mr-1">
        {cloneElement(icon, { className: 'w-5 lg:w-7.5' })}
      </div>

      <div className="font-medium text-xl lg:text-2xl">{children}</div>
    </div>
  );
};

interface HighlightValueProps {
  children?: React.ReactNode;
}

export const HighlightValue = (props: HighlightValueProps) => {
  const { children } = props;

  return (
    <div className="text-md lg:text-lg text-slate-600 text-right">
      {children}
    </div>
  );
};

interface HighlightButtonProps extends ButtonProps {
  children?: React.ReactNode;

  className?: string;
}

export const HighlightButton = (props: HighlightButtonProps) => {
  const { children, className, ...restProps } = props;

  return (
    <Button
      {...restProps}
      variant={ButtonVariant.None}
      className={classNames(
        'self-stretch lg:text-lg text-right py-1',
        className,
      )}
    >
      {children}
    </Button>
  );
};
