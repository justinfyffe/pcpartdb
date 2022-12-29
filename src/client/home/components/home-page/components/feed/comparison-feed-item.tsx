import { getProductComparisonSlug, getProductName } from '@client/product';
import { Card, Img } from '@client/shared/components';
import { classNames } from '@client/shared/ui';
import { getCompareGpusPath } from '@client/shared/website';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { Product, ProductComparison } from '@shared/product';
import { formatSpec } from '@shared/spec';
import React, { FunctionComponent, useMemo } from 'react';

interface ComparisonFeedItemProps {
  products: ProductComparison;

  as?: React.ElementType;
  className?: string;
}

export const ComparisonFeedItem: FunctionComponent<ComparisonFeedItemProps> = (
  props,
) => {
  const { products } = props;
  const [product1, product2] = products;

  const [price1, price2] = useMemo(
    () => [
      formatSpec(product1.specs?.launchPrice),
      formatSpec(product2.specs?.launchPrice),
    ],
    [product1, product2],
  );

  const [image1, image2] = useMemo(() => {
    return [
      product1.images?.details?.[0]?.image,
      product2.images?.details?.[0]?.image,
    ];
  }, [product1, product2]);

  return (
    <a
      href={getCompareGpusPath(getProductComparisonSlug(products))}
      className={classNames(
        'flex-1 mx-4 mb-6 max-w-96 min-w-70',
        props.className,
      )}
    >
      <Card as="article">
        <div className="relative flex gap-0.5 m-[-16px_-16px_0] rounded-t rounded-b-none h-40 w-[calc(100%_+_32px)] max-w-[calc(100%_+_48px)] overflow-hidden border-b-px">
          {image1 != null ? (
            <Img
              src={image1}
              className={classNames(
                'flex-1 h-40 object-cover overflow-hidden',
                props.className,
              )}
            />
          ) : (
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

          {image2 != null ? (
            <Img
              src={image2}
              className={classNames(
                'flex-1 h-40 object-cover overflow-hidden',
                props.className,
              )}
            />
          ) : (
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

          <div className="flex gap-11.5 w-full h-full absolute items-end justify-center">
            <Banner product={product1} />
            <Banner product={product2} />
          </div>

          <div className="flex w-full h-full absolute items-start justify-between rounded-t">
            <div className="text-[#ececec] font-normal px-1.5 py-0.5 text-2xs bg-[rgba(51,65,85,1)] border-b-px border-r-px border-gray-50 rounded-tl rounded-br">
              {price1}
            </div>
            <div className="text-[#ececec] font-normal px-1.5 py-0.5 text-2xs bg-[rgba(51,65,85,1)]  border-b-px border-l-px border-gray-50 rounded-tr rounded-bl">
              {price2}
            </div>
          </div>

          <div className="flex w-full h-full items-end justify-center absolute">
            <div className="text-[#ececec] font-semibold px-3 text-sm rounded-t bg-[rgba(51,65,85,1)] border-0.5 border-b-0 border-gray-50">
              VS
            </div>
          </div>
        </div>

        <div className="flex flex-col text-sm">
          <h3 className="font-medium text-base text-indigo-500">
            {getProductName(product1)} vs {getProductName(product2)}
          </h3>
          <Subtitle products={products} />
        </div>
      </Card>
    </a>
  );
};

interface BannerProps {
  product: Product;
}

const Banner: FunctionComponent<BannerProps> = (props) => {
  const { product } = props;
  const company = useMemo(
    () => product.specs?.company?.value?.toLowerCase(),
    [product],
  );

  return (
    <div
      className={classNames(
        'flex-1 text-[#ececec] font-semibold px-2 text-xs bg-[#666] border-t-px border-r-px border-gray-50 text-center',
        company === 'nvidia' ? 'bg-[#558501]' : '',
        company === 'amd' ? 'bg-[#850101]' : '',
      )}
    >
      {getProductName(product, { company: false })}
    </div>
  );
};

interface SubtitleProps {
  products: Product[];
}

const Subtitle: FunctionComponent<SubtitleProps> = (props) => {
  const { products } = props;
  const [product1, product2] = products;

  const name1 = useMemo(
    () => getProductName(product1, { company: false }),
    [product1],
  );
  const name2 = useMemo(
    () => getProductName(product2, { company: false }),
    [product2],
  );

  return (
    <>
      How does the {name1} compare to {name2}&apos;s performance?
    </>
  );
};
