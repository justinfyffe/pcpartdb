import { classNames } from '@client/shared/ui';
import React, { FunctionComponent, useContext, useEffect } from 'react';
import { AutocompleteContext } from './autocomplete-context';

export interface AutocompleteOptionProps {
  index: number;

  label: string;
  value: string;
  children?: React.ReactNode;

  className?: string;
  hoveredClassName?: string;
}

export const AutocompleteOption: FunctionComponent<AutocompleteOptionProps> = (
  props,
) => {
  const context = useContext(AutocompleteContext);
  const { onClick, onHovered, hoveredIndex } = context;

  const { index, label, value, children, className } = props;
  const hoveredClassName = props.hoveredClassName ?? 'bg-[#fafafa]';

  useEffect(() => {
    if (hoveredIndex === index) {
      onHovered({ label, value });
    }
  }, [onHovered, hoveredIndex, label, value, index]);

  return (
    <div
      onClick={() => onClick({ label, value })}
      className={classNames(
        'flex items-center px-2 py-4 cursor-pointer',
        `hover:${hoveredClassName}`,
        hoveredIndex === index ? hoveredClassName : '',
        className,
      )}
    >
      {children}
    </div>
  );
};
