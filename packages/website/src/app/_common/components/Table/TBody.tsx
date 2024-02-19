import React, { HTMLProps } from 'react';

interface TBodyProps extends HTMLProps<HTMLTableSectionElement> {}

export function TBody(props: TBodyProps) {
  const { children, ...htmlProps } = props;

  return <tbody {...htmlProps}>{children}</tbody>;
}
