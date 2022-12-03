import React, { FunctionComponent, useContext } from 'react';
import { classNames } from '../../ui';
import { AutocompleteContext } from '.';

interface AutocompleteChildProps {
  index: number;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  hoveredClassName?: string;
}

export const AutocompleteChild: FunctionComponent<AutocompleteChildProps> = (
  props,
) => {
  const { index, onClick, children, className, hoveredClassName } = props;

  const { hoveredIndex } = useContext(AutocompleteContext);

  return (
    <div
      onClick={onClick}
      className={classNames(
        'flex items-center px-2 py-4 cursor-pointer',
        hoveredIndex === index ? hoveredClassName : '',
        className,
      )}
    >
      {children}
    </div>
  );
};
