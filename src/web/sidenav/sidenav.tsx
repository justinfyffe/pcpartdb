import React, { FunctionComponent } from 'react';

interface SidenavProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

export const Sidenav: FunctionComponent<SidenavProps> = (props) => {
  const Element = props.as || 'aside';

  return <Element className={props.className}>{props.children}</Element>;
};
