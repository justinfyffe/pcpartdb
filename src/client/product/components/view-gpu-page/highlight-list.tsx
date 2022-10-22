import { Button, ButtonVariant } from '@client/shared/components';
import React, { cloneElement } from 'react';

interface HighlightListProps {
  children?: React.ReactNode;
}

export const HighlightList = (props: HighlightListProps) => {
  const { children } = props;
  return <ul className="flex flex-col gap-3 lg:gap-4">{children}</ul>;
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
        {cloneElement(icon, { className: 'w-[20px] lg:w-[30px]' })}
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

interface HighlightButtonProps {
  children?: React.ReactNode;
}

export const HighlightButton = (props: HighlightButtonProps) => {
  const { children } = props;

  return (
    <Button
      variant={ButtonVariant.Primary}
      className="self-stretch lg:text-lg text-right py-[4px]"
    >
      {children}
    </Button>
  );
};
