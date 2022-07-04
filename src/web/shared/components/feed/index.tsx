import { DesktopComputerIcon } from '@heroicons/react/outline';
import React, { FunctionComponent } from 'react';
import { classNames } from '../../ui/ui.utils';
import { Button, ButtonVariant } from '../button';
import { Card, CardActions, CardContent, CardImage, CardTitle } from '../card';
import { SectionHeader } from '../section-header';

interface FeedProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

interface FeedTitleProps {
  as?: React.ElementType;
  icon?: React.ElementType;

  children?: React.ReactNode;
}

interface FeedItemsProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

interface FeedItemProps {
  as?: React.ElementType;
  className?: string;
}

interface FeedLinksProps {
  className?: string;

  children?: React.ReactNode;
}

interface FeedLinkProps {
  className?: string;

  children?: React.ReactNode;
}

export const Feed: FunctionComponent<FeedProps> = (props) => {
  const Element = props.as || 'section';

  return (
    <Element className={classNames(props.className)}>{props.children}</Element>
  );
};

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

export const FeedItems: FunctionComponent<FeedItemsProps> = (props) => {
  const Element = props.as || 'div';

  return (
    <Element
      className={classNames(
        'flex flex-wrap justify-center mx-[-16px]',
        props.className,
      )}
    >
      {props.children}
    </Element>
  );
};

export const FeedItem: FunctionComponent<FeedItemProps> = (props) => {
  return (
    <Card
      className={classNames(
        'flex-1 mx-4 mb-6 max-w-[360px] min-w-[280px]',
        props.className,
      )}
    >
      <CardImage
        src="https://preview.redd.it/8siyqldph2x21.jpg?auto=webp&s=eeaa2cdf9c4e01746f4f46cc08c66e5eff77c630"
        width="360"
        height="200"
      ></CardImage>

      <CardTitle as="h3">
        <a href="#">RTX 3070 vs RTX 3060</a>
      </CardTitle>

      <CardContent>Is the 3070 better bang for your buck?</CardContent>

      <CardActions>
        <Button variant={ButtonVariant.Primary}>Compare</Button>
      </CardActions>
    </Card>
  );
};

export const FeedLinks: FunctionComponent<FeedLinksProps> = (props) => {
  return (
    <ul
      className={classNames(
        'list-none text-right font-medium',
        props.className,
      )}
    >
      {props.children}
    </ul>
  );
};

export const FeedLink: FunctionComponent<FeedLinkProps> = (props) => {
  return (
    <li className={classNames('inline-block mx-4', props.className)}>
      <a href="#">{props.children}</a>
    </li>
  );
};
