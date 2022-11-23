import { SectionHeader } from '@client/shared/components';
import { classNames } from '@client/shared/ui';
import React, { FunctionComponent } from 'react';

interface FeedTitleProps {
  as?: React.ElementType;
  icon?: React.ElementType;

  children?: React.ReactNode;
}

export const FeedTitle: FunctionComponent<FeedTitleProps> = (props) => {
  const Element = props.as || 'h2';
  const Icon = props.icon;

  return (
    <SectionHeader>
      {Icon && (
        <Icon className={classNames('inline-block h-6 w-6 mr-2 mb-1')} />
      )}
      <Element className={classNames('inline-block')}>{props.children}</Element>
    </SectionHeader>
  );
};
