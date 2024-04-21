import React, { FunctionComponent } from 'react';
import { classNames } from '../../../utils/classNames';

interface BenchmarksCreditProps {
  sourceName?: string;
  sourceUrl?: string;
  className?: string;
}

export const BenchmarksCredit: FunctionComponent<BenchmarksCreditProps> = (
  props,
) => {
  const { sourceName, sourceUrl, className } = props;

  return (
    <div
      className={classNames(
        'text-right p-1 text-sm text-dark-shades',
        className,
      )}
    >
      Benchmarks Source: <a href={sourceUrl}>{sourceName}</a>
    </div>
  );
};
