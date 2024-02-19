import React from 'react';
import { classNames } from '../../../../_common/utils/classNames';

interface FeedLinksProps {
  className?: string;

  children?: React.ReactNode;
}

export function FeedLinks(props: FeedLinksProps) {
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
}
