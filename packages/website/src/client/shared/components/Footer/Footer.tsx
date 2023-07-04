import React, { FunctionComponent } from 'react';
import { classNames } from '../../ui';

interface FooterProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

interface FooterSectionProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

interface FooterSectionTitleProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

export const Footer: FunctionComponent<FooterProps> = (props) => {
  const Element = props.as || 'footer';

  return (
    <Element
      className={classNames(
        'bg-main-brand text-default container p-container md:px-4 flex flex-wrap gap-8',
        props.className,
      )}
    >
      {props.children}
    </Element>
  );
};

export const FooterSection: FunctionComponent<FooterSectionProps> = (props) => {
  const Element = props.as || 'section';

  return (
    <Element className={classNames('flex-1 min-w-50 text-sm', props.className)}>
      {props.children}
    </Element>
  );
};

export const FooterSectionTitle: FunctionComponent<FooterSectionTitleProps> = (
  props,
) => {
  const Element = props.as || 'header';

  return (
    <Element
      className={classNames('border-b-px mb-3 text-base', props.className)}
    >
      {props.children}
    </Element>
  );
};
