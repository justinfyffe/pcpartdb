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
    <div
      className={classNames(
        'flex flex-wrap justify-end gap-4 font-medium',
        props.className,
      )}
    >
      {props.children}
    </div>
  );
};

export const FeedLink: FunctionComponent<FeedLinkProps> = (props) => {
  return (
    <a href="#" className={classNames('text-sm', props.className)}>
      {props.children}
    </a>
  );
};
