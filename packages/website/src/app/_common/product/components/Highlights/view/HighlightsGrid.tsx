import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import React, { FunctionComponent } from 'react';

interface HighlightsGridProps {
  className?: string;
  children?: React.ReactNode | React.ReactNode[];
}

export const HighlightsGrid: FunctionComponent<HighlightsGridProps> = (
  props,
) => {
  const { className } = props;

  return (
    <div
      className={classNames(
        'grid grid-cols-2 sm:flex flex-col gap-y-6 gap-x-6',
        className,
      )}
    >
      {props.children}
    </div>
  );
};
