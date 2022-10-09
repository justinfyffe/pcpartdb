import { Img } from '@client/shared/components';
import { classNames } from '@client/shared/ui';
import React, { FunctionComponent } from 'react';

interface ProductImageOptionProps {
  src: string;
  onClick: () => void;
  className?: string;
}

export const ProductImageOption: FunctionComponent<ProductImageOptionProps> = (
  props,
) => {
  const { src, className, onClick } = props;

  return (
    <div
      className={classNames(
        'bg-gray-50 border border-gray-200 flex items-center h-[60px] w-[60px]',
        className,
      )}
      onClick={onClick}
    >
      <Img className="h-auto mx-auto w-auto" src={src} />
    </div>
  );
};
