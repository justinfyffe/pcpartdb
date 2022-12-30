import { getProductName, getViewGpuSlug } from '@client/product';
import { Card, Img } from '@client/shared/components';
import { classNames } from '@client/shared/ui';
import { getViewGpuPath } from '@client/shared/website';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { Product } from '@shared/product';
import { formatSpec } from '@shared/spec';
import React, { FunctionComponent, useMemo } from 'react';

export enum ProductFeedTag {
  GreatPerformance = 'GREAT_PERFORMANCE',
  GreatValue = 'GREAT_VALUE',
}

interface ProductFeedItemProps {
  product: Product;
  tag?: ProductFeedTag;

  as?: React.ElementType;
  className?: string;
}

export const ProductFeedItem: FunctionComponent<ProductFeedItemProps> = (
  props,
) => {
  const { product, tag } = props;

  const price = useMemo(
    () => formatSpec(product.specs?.launchPrice),
    [product],
  );

  const label = useMemo(() => {
    if (tag === ProductFeedTag.GreatPerformance) {
      return 'Great Performance';
    } else if (tag === ProductFeedTag.GreatValue) {
      return 'Great Value';
    } else {
      return null;
    }
  }, [tag]);

  const images = useMemo(() => {
    const ret = [
      product.images?.details?.[0]?.image,
      product.images?.details?.[1]?.image,
    ];
    return ret.filter((image) => image != null);
  }, [product]);

  return (
    <a
      href={getViewGpuPath(getViewGpuSlug(product))}
      className={classNames(
        'flex-1',
        'mx-4 mb-6',
        'max-w-96 min-w-70',
        props.className,
      )}
    >
      <Card as="article">
        <div
          className={classNames(
            'relative',
            'flex gap-0.5',
            'm-[-16px_-16px_0]',
            'h-40 w-[calc(100%_+_32px)] max-w-[calc(100%_+_48px)]',
            'border-b-px rounded-t',
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
                'h-40',
                'object-cover overflow-hidden',
                props.className,
              )}
            />
          ))}
          {images.length === 0 && (
            <div
              className={classNames(
                'flex-1 flex flex-col items-center justify-center',
                'h-40',
              )}
            >
              <PhotoIcon className={classNames('-mb-3', 'w-23')} />
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
                  'font-normal text-2xs text-[#ececec]',
                  'px-1.5 py-0.5',
                  'border-b-px border-r-px border-gray-50 rounded-br rounded-tl',
                )}
              >
                {price}
              </div>
            )}

            {label && (
              <div
                className={classNames(
                  'bg-[rgba(51,65,85,1)]',
                  'font-normal text-2xs text-[#ececec]',
                  'px-1.5 py-0.5',
                  'border-b-px border-l-px border-gray-50 rounded-bl rounded-tr',
                )}
              >
                {label}
              </div>
            )}
          </div>
        </div>

        <div className={classNames('flex flex-col gap-2 text-sm')}>
          <h3 className="font-medium text-base text-indigo-500">
            {getProductName(product)}
          </h3>
          <Subtitle product={product} tag={tag} />
        </div>
      </Card>
    </a>
  );
};

interface SubtitleProps {
  product: Product;
  tag?: ProductFeedTag;
}

const Subtitle: FunctionComponent<SubtitleProps> = (props) => {
  const { product, tag } = props;

  const text = useMemo(() => {
    const name = getProductName(product, { company: false });

    if (tag === ProductFeedTag.GreatPerformance) {
      return `The ${name} is one of the strongest GPUs.`;
    } else if (tag === ProductFeedTag.GreatValue) {
      return `The ${name} has some of the best value on the market.`;
    } else {
      return `Learn more about the ${name}.`;
    }
  }, [product, tag]);

  return <>{text}</>;
};
