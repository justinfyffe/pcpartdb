import { classNames } from '@client/shared/ui';
import React, { FunctionComponent } from 'react';

export interface MenuItemProps {
  href?: string;
  children?: React.ReactNode;
  className?: string;
}

export const MenuLinkItem: FunctionComponent<MenuItemProps> = (props) => {
  const { href, children, className } = props;

  return (
    <a
      href={href}
      className={classNames('block p-2 hover:bg-slate-100', className)}
    >
      {children}
    </a>
  );
};
