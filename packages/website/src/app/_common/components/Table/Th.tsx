import React, { HTMLProps } from 'react';
import { classNames } from '../../utils/classNames';

interface ThProps extends HTMLProps<HTMLTableCellElement> {}

export function Th(props: ThProps) {
  const { children, className, ...htmlProps } = props;

  return (
    <th
      {...htmlProps}
      className={classNames('text-left p-2 font-medium', className)}
    >
      {children}
    </th>
  );
}
