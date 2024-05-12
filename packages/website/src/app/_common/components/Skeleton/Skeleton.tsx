import React from 'react';
import { classNames } from '../../utils/classNames';

interface SkeletonProps {
  as?: React.ElementType;
  className?: string;
  pulse?: boolean;
  left?: boolean;
  center?: boolean;
  right?: boolean;
}

export function Spinner(props: SkeletonProps) {
  const Element = props.as || 'div';

  return (
    <Element
      className={classNames(
        'bg-loading h-3 rounded-full',
        props.pulse ? 'animate-pulse' : '',
        props.left ? 'mr-auto' : '',
        props.center ? 'mx-auto' : '',
        props.right ? 'ml-auto' : '',
        props.className,
      )}
    />
  );
}
