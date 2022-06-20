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
        'flex flex-wrap gap-6 mx-auto items-center justify-start w-full max-w-[300px] lg:max-w-full',
        className,
      )}
    >
      <div className="bg-gray-50 border border-gray-200 flex items-center justify-center rounded aspect-square h-full w-auto max-h-[350px]">
        <Image
          className="h-auto mx-auto w-auto"
          src="https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ampere/rtx-3090/geforce-rtx-3090-shop-630-d@2x.png"
        />
      </div>

      <div className="flex flex-wrap w-full gap-6">
        <div className="bg-gray-50 border border-gray-200 h-20 w-20 flex items-center">
          <Image
            className="h-auto mx-auto w-auto"
            src="https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ampere/rtx-3090/geforce-rtx-3090-shop-630-d@2x.png"
          />
        </div>

        <div className="bg-gray-50 border border-gray-200 h-20 w-20 flex items-center">
          <Image
            className="h-auto mx-auto w-auto"
            src="https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ampere/rtx-3090/geforce-rtx-3090-shop-630-d@2x.png"
          />
        </div>

        <div className="bg-gray-50 border border-gray-200 h-20 w-20 flex items-center">
          <Image
            className="h-auto mx-auto w-auto"
            src="https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ampere/rtx-3090/geforce-rtx-3090-shop-630-d@2x.png"
          />
        </div>
      </div>
    </div>
  );
};
