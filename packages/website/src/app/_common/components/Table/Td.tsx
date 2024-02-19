import React, { HTMLProps } from 'react';
import { classNames } from '../../utils/classNames';

interface TdProps extends HTMLProps<HTMLTableCellElement> {}

export function Td(props: TdProps) {
  const { children, className, ...htmlProps } = props;

  return (
    <td {...htmlProps} className={classNames('p-2 text-left', className)}>
      {children}
    </td>
  );
}
