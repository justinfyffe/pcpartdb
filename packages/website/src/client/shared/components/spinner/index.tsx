import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

interface SpinnerProps {
  as?: React.ElementType;
  className?: string;
}

export const Spinner: FunctionComponent<SpinnerProps> = (props) => {
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
};
