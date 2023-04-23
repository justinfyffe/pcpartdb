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

  className?: string;
}

export const HighlightListItem = (props: HighlightListItemProps) => {
  const { children, className } = props;

  return (
    <li
      className={classNames(
        'bg-slate-200 flex items-center justify-center px-4 py-1 rounded shadow',
        className,
      )}
    >
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
      <div className={classNames('mr-1', icon.props?.className)}>
        {cloneElement(icon, {
          className: classNames('w-5', icon.props?.className),
        })}
      </div>

      <div className="font-medium md:text-sm text-xl">{children}</div>
    </div>
  );
};

interface HighlightValueProps {
  children?: React.ReactNode;

  className?: string;
}

export const HighlightValue = (props: HighlightValueProps) => {
  const { children, className } = props;

  return (
    <div
      className={classNames(
        'grid grid-cols-[auto_auto] grid-rows-2 gap-x-2',
        className,
      )}
    >
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
        'self-stretch text-base text-right py-1',
        className,
      )}
    >
      {children}
    </Button>
  );
};
