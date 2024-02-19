'use client';

import React, { useContext, useEffect } from 'react';
import { classNames } from '../../utils/classNames';
import { AutocompleteContext } from './AutocompleteContext';

export interface AutocompleteOptionProps {
  index: number;

  label: string;
  value: unknown;
  children?: React.ReactNode;

  className?: string;
  hoveredClassName?: string;
}

export function AutocompleteOption(props: AutocompleteOptionProps) {
  const context = useContext(AutocompleteContext);
  const { onClick, onHovered, hoveredIndex } = context;

  const { index, label, value, children, className } = props;
  const hoveredClassName = props.hoveredClassName ?? 'bg-mouse-hover';

  useEffect(() => {
    if (hoveredIndex === index) {
      onHovered?.({ label, value });
    }
  }, [onHovered, hoveredIndex, label, value, index]);

  return (
    <div
      onClick={() => onClick?.({ label, value })}
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
}
