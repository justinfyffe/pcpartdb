import React, { FunctionComponent } from 'react';
import { classNames } from '../../utils/classNames';

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
      className={classNames('block p-2 hover:bg-mouse-hover', className)}
    >
      {children}
    </a>
  );
};
