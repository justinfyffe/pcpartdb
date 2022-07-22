import React, { FunctionComponent } from 'react';
import { classNames } from '../../ui/ui.utils';

interface SpinnerProps {
  as?: React.ElementType;
  className?: string;
}

export const Spinner: FunctionComponent<SpinnerProps> = (props) => {
  const Element = props.as || 'div';

  return (
    <Element
      className={classNames(
        'animate-spin border-4 border-solid border-[#f3f3f3] rounded-[50%]',
        'border-t-[#333] inline-block h-6 left-[50%] absolute top-[50%]',
        'w-6 translate-x-[-50%] translate-y-[-50%]',
        props.className,
      )}
    />
  );
};
