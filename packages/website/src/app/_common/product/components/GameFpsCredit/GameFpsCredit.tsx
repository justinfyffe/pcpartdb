import React, { FunctionComponent } from 'react';
import { classNames } from '../../../utils/classNames';

interface GameFpsCreditProps {
  sourceName?: string;
  sourceUrl?: string;
  className?: string;
}

export const GameFpsCredit: FunctionComponent<GameFpsCreditProps> = (props) => {
  const { sourceName, sourceUrl, className } = props;

  return (
    <div
      className={classNames(
        'text-right p-1 text-sm text-dark-shades',
        className,
      )}
    >
      FPS Source: <a href={sourceUrl}>{sourceName}</a>
    </div>
  );
};
