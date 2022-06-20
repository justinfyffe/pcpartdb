import React, { FunctionComponent } from 'react';
import { classNames } from '../../ui/ui.utils';

interface BreadcrumbItemProps {
  link?: string;
  text: string;
}

interface BreadcrumbsProps {
  className?: string;
  items?: BreadcrumbItemProps[];
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
              <BreadcrumbItem {...item} />
            </React.Fragment>
          );
        })}
    </ul>
  );
};

const BreadcrumbItem: FunctionComponent<BreadcrumbItemProps> = (props) => {
  const { link, text } = props;
  return <li>{link ? <a href={link}>{text}</a> : text}</li>;
};
