import React, { HTMLProps } from 'react';

interface THeadProps extends HTMLProps<HTMLTableSectionElement> {}

export function THead(props: THeadProps) {
  const { children, ...htmlProps } = props;

  return <thead {...htmlProps}>{children}</thead>;
}
