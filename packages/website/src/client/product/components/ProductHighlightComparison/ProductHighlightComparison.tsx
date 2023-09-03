import React, { cloneElement } from 'react';
import { classNames } from '../../../shared/ui';

type Value = {
  name: string;
  value: React.ReactElement | string;
  bold?: boolean;
};

interface ProductHighlightComparisonProps {
  icon?: React.ReactElement;
  label: React.ReactElement | string;
  values?: Value[];

  className?: string;
}

export const ProductHighlightComparison = (
  props: ProductHighlightComparisonProps,
) => {
  const { icon, label, values, className } = props;

  return (
    <div
      className={classNames(
        'bg-light-shades flex flex-col px-4 py-1 rounded shadow items-center gap-2',
        className,
      )}
    >
      <div className={classNames('flex gap-2 items-center mr-auto', className)}>
        {icon && (
          <div className="mr-1">{cloneElement(icon, { className: 'w-5' })}</div>
        )}

        <div className="font-medium md:text-base text-xl whitespace-nowrap">
          {label}
        </div>
      </div>

      <div
        className={classNames(
          'ml-auto grid grid-cols-[auto_auto] grid-rows-2 gap-x-2 items-center',
          className,
        )}
      >
        {values?.map(({ name, value, bold }, i) => (
          <React.Fragment key={`idx-${i}`}>
            <div
              className={classNames(
                'text-right text-ellipsis',
                bold ? 'font-bold' : '',
                className,
              )}
            >
              {name}:
            </div>
            <div
              className={classNames(
                'text-right whitespace-nowrap',
                bold ? 'font-bold' : '',
                className,
              )}
            >
              {value}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
