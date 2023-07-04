import { PhotoIcon } from '@heroicons/react/24/outline';
import {
  getCompareProductsPath,
  Product,
  ProductComparison,
  ProductType,
} from '@pcpartdb/shared';
import {
  formatProductField,
  formatProductName,
} from 'packages/website/src/client/product';
import React, { FunctionComponent, useMemo } from 'react';
import { getCompanyLogoFeedPath } from '../../../../../image';
import { Card, Img } from '../../../../../shared/components';
import {
  compileContentComponent,
  ContentComponentParams,
  ContentContext,
} from '../../../../../shared/content';
import { classNames } from '../../../../../shared/ui';

export enum ProductComparisonFeedTag {
  ComparePerformance = 'COMPARE_PERFORMANCE',
  CompareValue = 'COMPARE_VALUE',
}

interface ProductComparisonFeedItemProps {
  productType: ProductType;
  comparison: ProductComparison;
  tag?: ProductComparisonFeedTag;

  as?: React.ElementType;
  className?: string;
}

export const ProductComparisonFeedItem: FunctionComponent<
  ProductComparisonFeedItemProps
> = (props) => {
  const { productType, comparison, tag } = props;
  const [product1, product2] = comparison;

  const [name1, name2] = useMemo(() => {
    return [
      formatProductName(productType, product1),
      formatProductName(productType, product2),
    ];
  }, [productType, product1, product2]);

  const [price1, price2] = useMemo(
    () => [
      formatProductField(productType, product1.launchPrice),
      formatProductField(productType, product2.launchPrice),
    ],
    [productType, product1, product2],
  );

  const [image1, image2] = useMemo(() => {
    return [
      product1.images?.[0]?.image ?? getCompanyLogoFeedPath(product1),
      product2.images?.[0]?.image ?? getCompanyLogoFeedPath(product2),
    ];
  }, [product1, product2]);

  const [isCompanyImage1, isCompanyImage2] = useMemo(() => {
    return [
      image1 === getCompanyLogoFeedPath(product1),
      image2 === getCompanyLogoFeedPath(product2),
    ];
  }, [product1, image1, product2, image2]);

  return (
    <a
      href={getCompareProductsPath(productType, comparison)}
      className={classNames(
        'flex-1 mx-4 mb-6 max-w-96 min-w-70',
        props.className,
      )}
    >
      <Card as="article" className="h-full">
        <div className="bg-white relative flex gap-0.5 m-[-16px_-16px_0] rounded-t rounded-b-none h-40 w-[calc(100%_+_32px)] max-w-[calc(100%_+_48px)] overflow-hidden border-b-px">
          {image1 != null ? (
            <Img
              src={image1}
              alt={name1}
              className={classNames(
                'flex-1 h-40 object-contain overflow-hidden',
                isCompanyImage1 ? 'p-8' : '',
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
              alt={name2}
              className={classNames(
                'flex-1 h-40 object-contain overflow-hidden',
                isCompanyImage2 ? 'p-8' : '',
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

          <div className="flex flex-1 w-full h-full absolute items-end">
            <Banner
              productType={productType}
              product={product1}
              className="mr-[23px] max-w-[calc(50%-23px)]"
            />
            <Banner
              productType={productType}
              product={product2}
              className="ml-[23px] max-w-[calc(50%-23px)]"
            />
          </div>

          <div className="flex w-full h-full absolute items-start justify-between rounded-t">
            {price1 != null && (
              <div className="text-[#ececec] font-normal px-1.5 py-0.5 text-sm bg-main-brand border-b-px border-r-px border-gray-50 rounded-tl rounded-br">
                {price1}
              </div>
            )}
            {price2 != null && (
              <div className="text-[#ececec] font-normal px-1.5 py-0.5 text-sm bg-main-brand  border-b-px border-l-px border-gray-50 rounded-tr rounded-bl">
                {price2}
              </div>
            )}
          </div>

          <div className="flex w-full h-full items-end justify-center absolute">
            <div className="text-[#ececec] font-semibold px-3 text-base rounded-t bg-main-brand border-0.5 border-b-0 border-gray-50">
              VS
            </div>
          </div>
        </div>

        <div className="flex flex-col text-base">
          <h3 className="font-medium text-lg text-link">
            {name1} vs {name2}
          </h3>
          <Subtitle
            productType={productType}
            comparison={comparison}
            tag={tag}
          />
        </div>
      </Card>
    </a>
  );
};

interface BannerProps {
  productType: ProductType;
  product: Product;
  className?: string;
}

const Banner: FunctionComponent<BannerProps> = (props) => {
  const { productType, product, className } = props;
  const company = useMemo(
    () => product.company?.value?.toLowerCase(),
    [product],
  );

  return (
    <div
      className={classNames(
        'flex-1 text-light-shades font-semibold px-2 text-sm bg-main-brand',
        'border-t-px border-r-px border-gray-50 text-center',
        'text-ellipsis overflow-hidden whitespace-nowrap',
        company === 'nvidia' ? 'bg-nvidia' : '',
        company === 'amd' ? 'bg-amd' : '',
        company === 'intel' ? 'bg-intel' : '',
        className,
      )}
    >
      {formatProductName(productType, product, { company: false })}
    </div>
  );
};

interface SubtitleProps {
  productType: ProductType;
  comparison: ProductComparison;
  tag?: ProductComparisonFeedTag;
}

const Subtitle: FunctionComponent<SubtitleProps> = (props) => {
  const { productType, comparison, tag } = props;
  const [product1, product2] = comparison;

  const params: ContentComponentParams = useMemo(
    () => ({
      name1: formatProductName(productType, product1, { company: false }),
      name2: formatProductName(productType, product2, { company: false }),
    }),
    [productType, product1, product2],
  );

  return (
    <ContentContext.Provider value={{ tags: [tag], params }}>
      <SubtitleSentence1 />
    </ContentContext.Provider>
  );
};

const SubtitleSentence1 = compileContentComponent(
  {
    tags: [ProductComparisonFeedTag.ComparePerformance],
    deps: ['name1', 'name2'],
    component: (props) => (
      <>
        Does the {props.name1} outperform the {props.name2}?
      </>
    ),
  },
  {
    tags: [ProductComparisonFeedTag.CompareValue],
    component: () => <>Which of these have the better bang for your buck?</>,
  },
  {
    deps: ['name1', 'name2'],
    component: (props) => (
      <>
        How does the {props.name1} compare with the {props.name2}?
      </>
    ),
  },
);
