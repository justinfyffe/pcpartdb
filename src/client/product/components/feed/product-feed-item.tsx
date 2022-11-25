import { Card, Img } from '@client/shared/components';
import { classNames } from '@client/shared/ui';
import { PhotoIcon } from '@heroicons/react/24/outline';
import {
  getProductDetailsPath,
  getProductName,
  Product,
} from '@shared/product';
import { formatSpec } from '@shared/spec';
import { useRouter } from 'next/router';
import React, {
  FunctionComponent,
  MouseEvent,
  useCallback,
  useMemo,
} from 'react';

interface ProductFeedItemProps {
  product: Product;

  as?: React.ElementType;
  className?: string;
}

export const ProductFeedItem: FunctionComponent<ProductFeedItemProps> = (
  props,
) => {
  const { product } = props;
  const router = useRouter();

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

  const handleClick = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      router.push(getProductDetailsPath(product));
    },
    [router, product],
  );

  return (
    <Card
      onClick={handleClick}
      className={classNames(
        'flex-1 mx-4 mb-6 max-w-[420px] min-w-[280px] cursor-pointer',
        props.className,
      )}
    >
      <div className="relative flex gap-[2px] m-[-16px_-16px_0] rounded-t rounded-b-none h-[160px] w-[calc(100%_+_32px)] max-w-[calc(100%_+_48px)] overflow-hidden border-b">
        {images.map((image, i) => (
          <Img
            key={i}
            src={image}
            className={classNames(
              'flex-1 h-[160px] object-cover overflow-hidden bg-white',
              props.className,
            )}
          />
        ))}
        {images.length === 0 && (
          <div className="flex-1 h-[160px] flex flex-col items-center justify-center">
            <PhotoIcon className="w-[92px] h-[92px] mb-[-12px]" />
            <span className="font-semibold">No Image</span>
          </div>
        )}

        <div className="flex w-full h-full absolute items-start justify-between rounded-t">
          {price != null && (
            <div className="text-[#ececec] font-normal px-[6px] py-[2px] text-sm bg-[rgba(51,65,85,1)] border-b border-r border-gray-50 rounded-tl rounded-br">
              {price}
            </div>
          )}

          <div className="text-[#ececec] font-normal px-[6px] py-[2px] text-sm bg-[rgba(51,65,85,1)]  border-b border-l border-gray-50 rounded-tr rounded-bl">
            Best Performance
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 text-md">
        <h3 className="font-medium text-xl text-indigo-500">
          <a href={getProductDetailsPath(product)}>{getProductName(product)}</a>
        </h3>
        The RTX 3070 is the best performing NVIDIA GPU in our database.
      </div>
    </Card>
  );
};
