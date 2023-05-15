import React, { Children, FunctionComponent } from 'react';
import { classNames } from '../../ui';
import { BreadcrumbProps } from './Breadcrumb';

interface BreadcrumbsProps {
  children?:
    | React.ReactElement<BreadcrumbProps>[]
    | React.ReactElement<BreadcrumbProps>;

  className?: string;
}

export const Breadcrumbs: FunctionComponent<BreadcrumbsProps> = (props) => {
  const { className, children } = props;

  return (
    <ul className={classNames('flex gap-3 text-sm w-full', className)}>
      {Children.map(children, (child, i) => (
        <>
          {child?.props?.children != null && i > 0 && <li>/</li>}
          {child}
        </>
      ))}
    </ul>
  );
};
