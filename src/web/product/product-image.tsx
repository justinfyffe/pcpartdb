import React, { FunctionComponent } from 'react';
import { Image } from '../shared/components/image';
import { classNames } from '../shared/ui/ui.utils';

interface ProductImageProps {
  className?: string;
}

export const ProductImage: FunctionComponent<ProductImageProps> = (props) => {
  const { className } = props;

  return (
    <div
      className={classNames(
        'flex flex-wrap gap-3 mx-auto items-center justify-start w-full',
        className,
      )}
    >
      <div className="aspect-square bg-gray-50 border border-gray-200 flex items-center justify-center rounded w-auto">
        <Image
          className="h-auto mx-auto w-auto"
          src="https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ampere/rtx-3090/geforce-rtx-3090-shop-630-d@2x.png"
        />
      </div>

      <div className="flex flex-wrap w-full gap-4">
        <div className="bg-gray-50 border border-gray-200 flex items-center h-[60px] w-[60px]">
          <Image
            className="h-auto mx-auto w-auto"
            src="https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ampere/rtx-3090/geforce-rtx-3090-shop-630-d@2x.png"
          />
        </div>

        <div className="bg-gray-50 border border-gray-200 flex items-center h-[60px] w-[60px] w-auto">
          <Image
            className="h-auto mx-auto w-auto"
            src="https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ampere/rtx-3090/geforce-rtx-3090-shop-630-d@2x.png"
          />
        </div>

        <div className="bg-gray-50 border border-gray-200 flex items-center h-[60px] w-[60px]">
          <Image
            className="h-auto mx-auto w-auto"
            src="https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ampere/rtx-3090/geforce-rtx-3090-shop-630-d@2x.png"
          />
        </div>
      </div>
    </div>
  );
};
