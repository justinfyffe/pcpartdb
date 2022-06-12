import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

interface SectionHeaderProps {
  as?: React.ElementType;
  className?: string;
  center?: boolean;

  children?: React.ReactNode;
}

interface SectionHeaderTitleProps {
  children?: React.ReactNode;
}

interface SectionHeaderLineProps {
  small: boolean;
}

export const SectionHeader: FunctionComponent<SectionHeaderProps> = (props) => {
  const { center = false } = props;
  const Element = props.as ?? 'div';

  return (
    <Element
      className={classNames(props.className, 'flex items-center mb-6 w-full')}
    >
      <SectionHeaderLine small={!center} />
      <SectionHeaderTitle>{props.children}</SectionHeaderTitle>
      <SectionHeaderLine small={false} />
    </Element>
  );
};

export const SectionHeaderTitle: FunctionComponent<SectionHeaderTitleProps> = (
  props,
) => {
  return (
    <div
      className={classNames(
        'font-normal inline-block px-2 text-xl md:text-2xl text-neutral-900',
      )}
    >
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
