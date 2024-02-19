import React, { FunctionComponent } from 'react';
import { classNames } from '../../utils/classNames';

export interface BreadcrumbProps {
  href?: string;

  children?: React.ReactNode;
  className?: string;
}

export const Breadcrumb: FunctionComponent<BreadcrumbProps> = (props) => {
  const { href, className, children } = props;

  return (
    <li className={classNames(className)}>
      {href != null ? <a href={href}>{children}</a> : children}
    </li>
  );
};
