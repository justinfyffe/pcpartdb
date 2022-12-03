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
        'bg-footer text-footer container flex flex-wrap gap-8 px-8 py-4',
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
    <Element className={classNames('flex-1 min-w-50 text-xs', props.className)}>
      {props.children}
    </Element>
  );
};

export const FooterSectionTitle: FunctionComponent<FooterSectionTitleProps> = (
  props,
) => {
  const Element = props.as || 'header';

  return (
    <Element className={classNames('border-b mb-3 text-sm', props.className)}>
      {props.children}
    </Element>
  );
};
