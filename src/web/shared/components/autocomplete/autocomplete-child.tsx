import React, { FunctionComponent, useContext } from 'react';
import { classNames } from '../../ui/ui.utils';
import { AutocompleteContext } from '.';

export const AutocompleteChild: FunctionComponent<AutocompleteChildProps> = (
  props,
) => {
  const { index, onClick, children, className, hoveredClassName } = props;

  const { hoveredIndex } = useContext(AutocompleteContext);

  return (
    <div
      onClick={onClick}
      className={classNames(
        'items-center pointer flex p-[8px_16px]',
        hoveredIndex === index ? hoveredClassName : '',
        className,
      )}
    >
      {children}
    </div>
  );
};

interface AutocompleteChildProps {
  index: number;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  hoveredClassName?: string;
}
