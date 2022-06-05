import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

interface JumbotronProps {
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;

  children?: React.ReactNode;
}

export const Jumbotron: FunctionComponent<JumbotronProps> = (props) => {
  const Element = props.as || 'section';

  return (
    <Element
      className={classNames(
        'bg-cover bg-repeat-space flex h-120 items-center justify-center rounded shadow',
        props.className,
      )}
      style={props.style}
    >
      {props.children}
    </Element>
  );
};
