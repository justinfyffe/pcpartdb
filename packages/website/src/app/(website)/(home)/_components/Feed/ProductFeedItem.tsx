import { PhotoIcon } from '@heroicons/react/24/outline';
import {
  formatProductName,
  getViewProductPath,
  Image,
  Product,
  productFieldFormattedValue,
} from '@pcpartdb/shared';
import React from 'react';
import { Card } from '../../../../_common/components/Card/Card';
import { Img } from '../../../../_common/components/Img/Img';
import { ContentProvider } from '../../../../_common/content/ContentProvider';
import { ContentComponentParams } from '../../../../_common/content/types';
import { classNames } from '../../../../_common/utils/classNames';
import { companyLogoFeedPath } from '../../../../_common/utils/companyLogoFeedPath';
import { ProductItemSubtitle } from './content';
import { ProductFeedTag } from './types';

interface ProductFeedItemProps {
  product: Product;
  tag?: ProductFeedTag;

  as?: React.ElementType;
  className?: string;
}

export function ProductFeedItem(props: ProductFeedItemProps) {
  const { product, tag } = props;

  const name = formatProductName(product);
  const price = productFieldFormattedValue(product.fields?.msrp);

  let label: string = null;
  if (tag === ProductFeedTag.GreatPerformance) {
    label = 'Great Performance';
  } else if (tag === ProductFeedTag.GreatValue) {
    label = 'Great Value';
  }

  const images = [
    product.images?.[0]?.image,
    product.images?.[1]?.image ?? companyLogoFeedPath(product),
  ].filter((image) => !!image) as (Image | string)[];

  const isCompanyImages = images.map(
    (image) => image === companyLogoFeedPath(product),
  );

  return (
    <a
      href={getViewProductPath(product)}
      className={classNames(
        'flex-1',
        'mx-4 mb-6',
        'max-w-96 min-w-70',
        props.className,
      )}
    >
      <Card as="article" className="h-full">
        <div
          className={classNames(
            'bg-white',
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
              alt={name || undefined}
              className={classNames(
                'bg-white',
                'flex-1',
                'h-40',
                'object-contain overflow-hidden',
                isCompanyImages[i] ? 'p-4' : '',
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
                  'bg-main-brand',
                  'font-normal text-sm text-light-shades',
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
                  'bg-main-brand',
                  'font-normal text-sm text-light-shades',
                  'px-1.5 py-0.5',
                  'border-b-px border-l-px border-gray-50 rounded-bl rounded-tr',
                )}
              >
                {label}
              </div>
            )}
          </div>
        </div>

        <div className={classNames('flex flex-col gap-2 text-base')}>
          <h3 className="font-semibold text-lg text-link">
            {formatProductName(product)}
          </h3>
          <Subtitle product={product} tag={tag} />
        </div>
      </Card>
    </a>
  );
}

interface SubtitleProps {
  product: Product;
  tag?: ProductFeedTag;
}

function Subtitle(props: SubtitleProps) {
  const { product, tag } = props;

  const tags = tag ? [tag] : [];
  const params: ContentComponentParams = {
    name: formatProductName(product, { company: false }),
  };

  return (
    <ContentProvider tags={tags} params={params}>
      <ProductItemSubtitle />
    </ContentProvider>
  );
}
