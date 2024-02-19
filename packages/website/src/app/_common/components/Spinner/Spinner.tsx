import React from 'react';
import { classNames } from '../../utils/classNames';

interface SpinnerProps {
  as?: React.ElementType;
  className?: string;
}

export function Spinner(props: SpinnerProps) {
  const Element = props.as || 'div';

  return (
    <Element
      className={classNames(
        'animate-spin border-1 border-solid border-[#f3f3f3] rounded-[50%]',
        'border-t-[#333] inline-block h-6 w-6',
        props.className,
      )}
    />
  );
}
