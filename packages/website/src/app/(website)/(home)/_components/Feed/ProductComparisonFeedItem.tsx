import { PhotoIcon } from '@heroicons/react/24/outline';
import {
  formatProductName,
  getCompareProductsPath,
  Product,
  ProductComparison,
  productFieldFormattedValue,
} from '@pcpartdb/shared';
import React, { FunctionComponent, useMemo } from 'react';
import { Card } from '../../../../_common/components/Card/Card';
import { Img } from '../../../../_common/components/Img/Img';
import { ContentProvider } from '../../../../_common/content/ContentProvider';
import { ContentComponentParams } from '../../../../_common/content/types';
import { classNames } from '../../../../_common/utils/classNames';
import { companyLogoFeedPath } from '../../../../_common/utils/companyLogoFeedPath';
import { ProductComparisonItemSubtitle } from './content';
import { ProductComparisonFeedTag } from './types';

interface ProductComparisonFeedItemProps {
  comparison: ProductComparison;
  tag?: ProductComparisonFeedTag;

  as?: React.ElementType;
  className?: string;
}

export function ProductComparisonFeedItem(
  props: ProductComparisonFeedItemProps,
) {
  const { comparison, tag } = props;
  const [product1, product2] = comparison;

  const name1 = formatProductName(product1);
  const name2 = formatProductName(product2);

  const price1 = productFieldFormattedValue(product1.fields?.msrp);
  const price2 = productFieldFormattedValue(product2.fields?.msrp);

  const image1 = product1.images?.[0]?.image ?? companyLogoFeedPath(product1);
  const image2 = product2.images?.[0]?.image ?? companyLogoFeedPath(product2);

  const isCompanyImage1 = image1 === companyLogoFeedPath(product1);
  const isCompanyImage2 = image2 === companyLogoFeedPath(product2);

  return (
    <a
      href={getCompareProductsPath({ comparison })}
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
              alt={name1 || undefined}
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
              alt={name2 || undefined}
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
              product={product1}
              className="mr-[23px] max-w-[calc(50%-23px)]"
            />
            <Banner
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

        <div className="flex flex-col text-base text-content">
          <h3 className="font-medium text-lg text-link">
            {name1} vs {name2}
          </h3>
          <Subtitle comparison={comparison} tag={tag} />
        </div>
      </Card>
    </a>
  );
}

interface BannerProps {
  product: Partial<Product>;
  className?: string;
}

const Banner: FunctionComponent<BannerProps> = (props) => {
  const { product, className } = props;
  const company = useMemo(() => product.company?.toLowerCase(), [product]);

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
      {formatProductName(product, { company: false })}
    </div>
  );
};

interface SubtitleProps {
  comparison: ProductComparison;
  tag?: ProductComparisonFeedTag;
}

function Subtitle(props: SubtitleProps) {
  const { comparison, tag } = props;
  const [product1, product2] = comparison;

  const tags = tag ? [tag] : [];
  const params: ContentComponentParams = {
    name1: formatProductName(product1, { company: false }),
    name2: formatProductName(product2, { company: false }),
  };

  return (
    <ContentProvider tags={tags} params={params}>
      <ProductComparisonItemSubtitle />
    </ContentProvider>
  );
}
