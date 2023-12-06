import React, { cloneElement } from 'react';
import { classNames } from '../../../shared/ui/classNames';

interface ProductHighlightProps {
  icon?: React.ReactElement;
  label: React.ReactElement | string;
  value?: React.ReactElement | string;

  className?: string;
}

export const ProductHighlight = (props: ProductHighlightProps) => {
  const { icon, label, value, className } = props;

  return (
    <div
      className={classNames(
        'bg-light-shades flex flex-wrap px-4 py-2 rounded shadow items-center',
      )}
    >
      <div className={classNames('flex-auto flex gap-2 items-center')}>
        {icon && (
          <div className="mr-1">{cloneElement(icon, { className: 'w-5' })}</div>
        )}

        <div className="font-medium md:text-base text-xl">{label}</div>
      </div>

      <div
        className={classNames(
          'flex-auto md:text-base text-content text-right',
          className,
        )}
      >
        {value}
      </div>
    </div>
  );
};
