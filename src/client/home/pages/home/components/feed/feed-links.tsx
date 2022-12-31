import { classNames } from '@client/shared/ui';
import React, { FunctionComponent } from 'react';

interface FeedLinksProps {
  className?: string;

  children?: React.ReactNode;
}

interface FeedLinkProps {
  className?: string;
  href?: string;

  children?: React.ReactNode;
}

export const FeedLinks: FunctionComponent<FeedLinksProps> = (props) => {
  return (
    <div
      className={classNames(
        'flex flex-wrap justify-end gap-8 font-medium',
        props.className,
      )}
    >
      {props.children}
    </div>
  );
};

export const FeedLink: FunctionComponent<FeedLinkProps> = (props) => {
  const { href } = props;
  return (
    <a href={href} className={classNames('text-sm', props.className)}>
      {props.children}
    </a>
  );
};
