import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

interface ArticleProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

export const Article: FunctionComponent<ArticleProps> = (props) => {
  const Element = props.as || 'article';

  return (
    <Element className={classNames('w-full', props.className)}>
      {props.children}
    </Element>
  );
};

interface ArticleHeaderProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

export const ArticleHeader: FunctionComponent<ArticleHeaderProps> = (props) => {
  const Element = props.as || 'header';

  return (
    <Element
      className={classNames(
        'flex items-center justify-between mb-4',
        props.className,
      )}
    >
      {props.children}
    </Element>
  );
};
