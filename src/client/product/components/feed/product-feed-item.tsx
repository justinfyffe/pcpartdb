import { Card, Img } from '@client/shared/components';
import { classNames } from '@client/shared/ui';
import { PhotoIcon } from '@heroicons/react/24/outline';
import {
  getProductDetailsPath,
  getProductName,
  Product,
} from '@shared/product';
import { formatSpec } from '@shared/spec';
import React, { FunctionComponent, useMemo } from 'react';

interface ProductFeedItemProps {
  product: Product;

  as?: React.ElementType;
  className?: string;
}

export const ProductFeedItem: FunctionComponent<ProductFeedItemProps> = (
  props,
) => {
  const { product } = props;

  const price = useMemo(
    () => formatSpec(product.specs?.launchPrice),
    [product],
  );

  const images = useMemo(() => {
    const ret = [
      product.images?.details?.[0]?.image,
      product.images?.details?.[1]?.image,
    ];
    return ret.filter((image) => image != null);
  }, [product]);

  return (
    <a href={getProductDetailsPath(product)}>
      <Card
        className={classNames(
          'flex-1',
          'mx-4 mb-6',
          'max-w-[384px] min-w-[280px]',
          props.className,
        )}
      >
        <div
          className={classNames(
            'relative',
            'flex gap-[2px]',
            'm-[-16px_-16px_0]',
            'h-[160px] w-[calc(100%_+_32px)] max-w-[calc(100%_+_48px)]',
            'border-b rounded-t',
            'overflow-hidden',
          )}
        >
          {images.map((image, i) => (
            <Img
              key={i}
              src={image}
              className={classNames(
                'bg-white',
                'flex-1',
                'h-[160px]',
                'object-cover overflow-hidden',
                props.className,
              )}
            />
          ))}
          {images.length === 0 && (
            <div
              className={classNames(
                'flex-1 flex flex-col items-center justify-center',
                'h-[160px]',
              )}
            >
              <PhotoIcon
                className={classNames('mb-[-12px]', 'h-[92px] w-[92px]')}
              />
              <span className="font-semibold">No Image</span>
            </div>
          )}

          <div
            className={classNames(
              'absolute',
              'flex items-start justify-between',
              'rounded-t',
              'h-full w-full',
            )}
          >
            {price != null && (
              <div
                className={classNames(
                  'bg-[rgba(51,65,85,1)]',
                  'font-normal text-sm text-[#ececec]',
                  'px-[6px] py-[2px]',
                  'border-b border-r border-gray-50 rounded-br rounded-tl',
                )}
              >
                {price}
              </div>
            )}

            <div
              className={classNames(
                'bg-[rgba(51,65,85,1)]',
                'font-normal text-sm text-[#ececec]',
                'px-[6px] py-[2px]',
                'border-b border-l border-gray-50 rounded-bl rounded-tr',
              )}
            >
              Best Performance
            </div>
          </div>
        </div>

        <div className={classNames('flex flex-col gap-2', 'text-md')}>
          <h3 className="font-medium text-xl text-indigo-500">
            {getProductName(product)}
          </h3>
          The RTX 3070 is the best performing NVIDIA GPU in our database.
        </div>
      </Card>
    </a>
  );
};
