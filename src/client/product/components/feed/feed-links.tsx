import { classNames } from '@client/shared/ui';
import React, { FunctionComponent } from 'react';

interface FeedLinksProps {
  className?: string;

  children?: React.ReactNode;
}

interface FeedLinkProps {
  className?: string;

  children?: React.ReactNode;
}

export const FeedLinks: FunctionComponent<FeedLinksProps> = (props) => {
  return (
    <ul
      className={classNames(
        'list-none text-right font-medium',
        props.className,
      )}
    >
      {props.children}
    </ul>
  );
};

export const FeedLink: FunctionComponent<FeedLinkProps> = (props) => {
  return (
    <li className={classNames('inline-block mx-4', props.className)}>
      <a href="#">{props.children}</a>
    </li>
  );
};
