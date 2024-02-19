import React, { HTMLProps } from 'react';
import { classNames } from '../../utils/classNames';

interface TrProps extends HTMLProps<HTMLTableRowElement> {
  sticky?: boolean;
}

export function Tr(props: TrProps) {
  const { children, className, sticky, ...htmlProps } = props;

  return (
    <tr
      className={classNames(
        sticky
          ? 'sticky shadow-[inset_0px_-1px_0px_0px_#e5e7eb] top-[-1px] z-10 '
          : '',
        className,
      )}
      {...htmlProps}
    >
      {children}
    </tr>
  );
}
