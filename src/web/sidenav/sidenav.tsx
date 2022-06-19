import React, { FunctionComponent } from 'react';
import { classNames } from '../shared/ui/ui.utils';

interface SidenavProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

interface SidenavSectionProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

interface SidenavSectionTitleProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

export const Sidenav: FunctionComponent<SidenavProps> = (props) => {
  const Element = props.as || 'aside';

  return (
    <Element
      className={classNames('flex flex-col gap-6 w-[300px]', props.className)}
    >
      {props.children}
    </Element>
  );
};

export const SidenavSection: FunctionComponent<SidenavSectionProps> = (
  props,
) => {
  const Element = props.as || 'section';

  return (
    <Element className={classNames(props.className)}>{props.children}</Element>
  );
};

export const SidenavSectionTitle: FunctionComponent<
  SidenavSectionTitleProps
> = (props) => {
  const Element = props.as || 'header';

  return (
    <Element
      className={classNames(
        'flex font-medium gap-2 text-lg w-full',
        props.className,
      )}
    >
      {props.children}
    </Element>
  );
};
