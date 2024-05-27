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
        'bg-light-shades flex flex-col px-4 py-2 rounded shadow items-center gap-4',
        className,
      )}
    >
      <div className={classNames('flex gap-2 items-center mr-auto', className)}>
        {icon && (
          <div className="mr-1">{cloneElement(icon, { className: 'w-5' })}</div>
        )}

        <div className="font-medium text-lg">{label}</div>
      </div>

      <div className="w-full grid grid-cols-2 gap-x-4 gap-y-2">
        {!loading &&
          values?.map(({ name, bold }, i) => (
            <React.Fragment key={`idx-${i}`}>
              <div
                className={classNames(
                  'text-base text-center border-b-px border-b-primary pb-2 border-dotted',
                  bold ? 'font-semibold' : '',
                )}
              >
                {name}
              </div>
            </React.Fragment>
          ))}
        {!loading &&
          values?.map(({ value, bold, extra }, i) => (
            <React.Fragment key={`idx-${i}`}>
              <div
                className={classNames(
                  'w-full h-full text-base flex flex-col justify-start items-center gap-0.5',
                  bold ? 'font-semibold' : '',
                )}
              >
                <span className="text-base">{value}</span>
                <span className="text-sm">{extra != null && <>{extra}</>}</span>
              </div>
            </React.Fragment>
          ))}

        {loading && (
          <>
            <div
              className={classNames(
                'text-base text-center border-b-px border-b-primary pb-2 border-dotted',
              )}
            >
              <Skeleton className="w-28 h-3" pulse center />
            </div>
            <div
              className={classNames(
                'text-base text-center border-b-px border-b-primary pb-2 border-dotted',
              )}
            >
              <Skeleton className="w-28 h-3" pulse center />
            </div>
            <div
              className={classNames(
                'w-full h-full text-base flex flex-col justify-start items-center gap-2',
              )}
            >
              <Skeleton className="w-16 h-3" pulse center />
              <Skeleton className="w-16 h-3" pulse center />
            </div>
            <div
              className={classNames(
                'w-full h-full text-base flex flex-col justify-start items-center gap-2',
              )}
            >
              <Skeleton className="w-16 h-3" pulse center />
              <Skeleton className="w-16 h-3" pulse center />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
