import { PhotoIcon } from '@heroicons/react/24/outline';
import {
  formatProductField,
  formatProductName,
  getViewProductPath,
  Product,
  ProductType,
} from '@pcpartdb/shared';
import { Img } from 'packages/website/src/client/shared/components/Img/Img';
import React, { FunctionComponent, useMemo } from 'react';
import { getCompanyLogoFeedPath } from '../../../../../image';
import { Card } from '../../../../../shared/components';
import {
  compileContentComponent,
  ContentComponentParams,
  ContentContext,
} from '../../../../../shared/content';
import { classNames } from '../../../../../shared/ui';

export enum ProductFeedTag {
  GreatPerformance = 'GREAT_PERFORMANCE',
  GreatValue = 'GREAT_VALUE',
}

interface ProductFeedItemProps {
  productType: ProductType;
  product: Product;
  tag?: ProductFeedTag;

  as?: React.ElementType;
  className?: string;
}

export const ProductFeedItem: FunctionComponent<ProductFeedItemProps> = (
  props,
) => {
  const { productType, product, tag } = props;

  const name = useMemo(
    () => formatProductName(productType, product),
    [productType, product],
  );
  const price = useMemo(
    () => formatProductField(productType, product.launchPrice),
    [productType, product],
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
      product.images?.[0]?.image,
      product.images?.[1]?.image ?? getCompanyLogoFeedPath(product),
    ];
    return ret.filter((image) => image != null);
  }, [product]);

  const isCompanyImage = useMemo(() => {
    return images.map((image) => image === getCompanyLogoFeedPath(product));
  }, [product, images]);

  return (
    <a
      href={getViewProductPath(productType, product)}
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
              alt={name}
              className={classNames(
                'bg-white',
                'flex-1',
                'h-40',
                'object-contain overflow-hidden',
                isCompanyImage[i] ? 'p-4' : '',
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
            {formatProductName(productType, product)}
          </h3>
          <Subtitle productType={productType} product={product} tag={tag} />
        </div>
      </Card>
    </a>
  );
};

interface SubtitleProps {
  productType: ProductType;
  product: Product;
  tag?: ProductFeedTag;
}

const Subtitle: FunctionComponent<SubtitleProps> = (props) => {
  const { productType, product, tag } = props;

  const params: ContentComponentParams = useMemo(
    () => ({
      name: formatProductName(productType, product, { company: false }),
    }),
    [productType, product],
  );

  return (
    <ContentContext.Provider value={{ tags: [tag], params }}>
      <SubtitleSentence1 />
    </ContentContext.Provider>
  );
};

const SubtitleSentence1 = compileContentComponent(
  {
    tags: [ProductFeedTag.GreatPerformance],
    deps: ['name'],
    component: (props) => (
      <>The {props.name} has great performance, but is it worth the money?</>
    ),
  },
  {
    tags: [ProductFeedTag.GreatValue],
    deps: ['name'],
    component: (props) => (
      <>The {props.name} has great value, but how well does it perform?</>
    ),
  },
  {
    deps: ['name'],
    component: (props) => <>Learn more about the {props.name}.</>,
  },
);
