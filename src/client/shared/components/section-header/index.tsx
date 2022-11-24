import React, { FunctionComponent } from 'react';
import { classNames } from '../../ui';

interface SectionHeaderProps {
  as?: React.ElementType;
  className?: string;
  center?: boolean;
  lines?: boolean;

  children?: React.ReactNode;
}

interface SectionHeaderTitleProps {
  children?: React.ReactNode;
}

interface SectionHeaderLineProps {
  small: boolean;
}

export const SectionHeader: FunctionComponent<SectionHeaderProps> = (props) => {
  const { center = false, lines = true } = props;
  const Element = props.as ?? 'div';

  return (
    <Element
      className={classNames('flex items-center mb-6 w-full', props.className)}
    >
      <SectionHeaderTitle>{props.children}</SectionHeaderTitle>
    </Element>
  );
};

export const SectionHeaderTitle: FunctionComponent<SectionHeaderTitleProps> = (
  props,
) => {
  return (
    <div className={classNames('inline-block text-xl md:text-2xl')}>
      {props.children}
    </div>
  );
};

export const SectionHeaderLine: FunctionComponent<SectionHeaderLineProps> = (
  props,
) => {
  const { small } = props;

  return (
    <div
      className={classNames('bg-neutral-300 flex-1 h-px', {
        'flex-1 md:flex-none md:w-5': small,
      })}
    />
  );
};
