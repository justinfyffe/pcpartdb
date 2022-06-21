import React, { FunctionComponent } from 'react';
import { classNames } from '../../ui/ui.utils';

interface BreadcrumbProps {
  link?: string;
  text: string;
}

interface BreadcrumbsProps {
  className?: string;
  items?: BreadcrumbProps[];
}

export const Breadcrumbs: FunctionComponent<BreadcrumbsProps> = (props) => {
  const { className, items } = props;

  return (
    <ul className={classNames('flex gap-3 text-sm', className)}>
      {items &&
        items.map((item, i) => {
          return (
            <React.Fragment key={i}>
              {i > 0 && <li>/</li>}
              <Breadcrumb {...item} />
            </React.Fragment>
          );
        })}
    </ul>
  );
};

const Breadcrumb: FunctionComponent<BreadcrumbProps> = (props) => {
  const { link, text } = props;
  return <li>{link ? <a href={link}>{text}</a> : text}</li>;
};
