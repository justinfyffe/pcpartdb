import React, { cloneElement } from 'react';
import { Skeleton } from '../../../components/Skeleton/Skeleton';
import { classNames } from '../../../utils/classNames';

type Value = {
  name: string;
  value: React.ReactElement | string;
  bold?: boolean;
  extra?: React.ReactElement | string;
};

interface ProductHighlightComparisonProps {
  icon?: React.ReactElement;
  label: React.ReactElement | string;
  values?: Value[];

  loading?: boolean;
  className?: string;
}

export const ProductHighlightComparison = (
  props: ProductHighlightComparisonProps,
) => {
  const { icon, label, values, className, loading } = props;

  return (
    <div
      className={classNames(
        'bg-light-shades flex flex-col px-4 py-2 rounded shadow items-center gap-2',
        className,
      )}
    >
      <div className={classNames('flex gap-2 items-center mr-auto', className)}>
        {icon && (
          <div className="mr-1">{cloneElement(icon, { className: 'w-5' })}</div>
        )}

        <div className="font-medium md:text-base text-lg">{label}</div>
      </div>

      <div className="w-full flex flex-wrap justify-evenly gap-4">
        {!loading &&
          values?.map(({ name, value, bold, extra }, i) => (
            <React.Fragment key={`idx-${i}`}>
              <div
                className={classNames(
                  'flex flex-col items-center justify-between gap-0.5',
                  bold ? 'font-bold' : '',
                  className,
                )}
              >
                <span className="text-base">{name}</span>
                <div className="text-base flex gap-2 justify-center items-center">
                  {value}
                  {extra != null && <span className="text-xs">{extra}</span>}
                </div>
              </div>
            </React.Fragment>
          ))}

        {loading && (
          <>
            <div className="flex flex-col items-center justify-between gap-0.5">
              <div className="flex flex-col gap-3 h-[49px] justify-center">
                <Skeleton className="w-20 h-3" pulse />
                <Skeleton className="w-20 h-3" pulse />
              </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-0.5">
              <div className="flex flex-col gap-3 h-[49px] justify-center">
                <Skeleton className="w-20 h-3" pulse />
                <Skeleton className="w-20 h-3" pulse />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
