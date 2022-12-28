import { classNames } from '@client/shared/ui';
import React, { FunctionComponent } from 'react';

export interface MenuItemProps {
  href?: string;
  children?: React.ReactNode;
  className?: string;
}

export const MenuItem: FunctionComponent<MenuItemProps> = (props) => {
  const { href, children, className } = props;

  return (
    <a href={href} className={classNames('block p-2', className)}>
      {children}
    </a>
  );
};
