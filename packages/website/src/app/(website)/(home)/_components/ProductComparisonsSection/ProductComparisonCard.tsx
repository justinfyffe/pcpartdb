'use client';

import { PhotoIcon } from '@heroicons/react/24/outline';
import {
  formatProductName,
  getCompareProductsPath,
  HomeViewModel,
  Product,
  ProductType,
} from '@pcpartdb/shared';
import { Skeleton } from 'packages/website/src/app/_common/components/Skeleton/Skeleton';
import { useViewModelContext } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import React, { FunctionComponent, useMemo } from 'react';
import { Card } from '../../../../_common/components/Card/Card';
import { Img } from '../../../../_common/components/Img/Img';
import { ContentProvider } from '../../../../_common/content/ContentProvider';
import { classNames } from '../../../../_common/utils/classNames';
import { companyLogoFeedPath } from '../../../../_common/utils/companyLogoFeedPath';
import { CardSubtitle } from './content';
import { ProductComparisonCardTag } from './types';

const COMPARISON_MAP = {
  [ProductType.Cpu]: {
    [ProductComparisonCardTag.ComparePerformance]: (viewModel: HomeViewModel) =>
      viewModel.cpuData.performanceComparison,
    [ProductComparisonCardTag.CompareValue]: (viewModel: HomeViewModel) =>
      viewModel.cpuData.valueComparison,
  },
  [ProductType.Gpu]: {
    [ProductComparisonCardTag.ComparePerformance]: (viewModel: HomeViewModel) =>
      viewModel.gpuData.performanceComparison,
    [ProductComparisonCardTag.CompareValue]: (viewModel: HomeViewModel) =>
      viewModel.gpuData.valueComparison,
  },
};

interface ProductComparisonCardProps {
  productType: ProductType;
  tag: ProductComparisonCardTag;

  as?: React.ElementType;
  className?: string;
}

export function ProductComparisonCard(props: ProductComparisonCardProps) {
  const { productType, tag } = props;

  const { viewModel, loading } = useViewModelContext<HomeViewModel>();
  const comparison = COMPARISON_MAP[productType][tag](viewModel);
  const [product1, product2] = comparison;

  const [name1, name2] = useMemo(() => {
    return [formatProductName(product1), formatProductName(product2)];
  }, [product1, product2]);

  const image1 = companyLogoFeedPath(product1);
  const image2 = companyLogoFeedPath(product2);

  if (loading) {
    return <LoadingComparisonCard productType={productType} />;
  }

  return (
    <a
      href={getCompareProductsPath({ comparison })}
      className={classNames('flex-1 mx-4 mb-6 min-w-70', props.className)}
    >
      <Card as="article" className="gap-0 p-0">
        <div className="bg-white flex rounded-t rounded-b-none overflow-hidden border-b-px">
          {image1 != null && (
            <Img
              src={image1}
              alt={name1 || undefined}
              className={classNames(
                'flex-1 h-20 object-contain overflow-hidden mr-[17px] p-4',
              )}
            />
          )}

          {image2 != null && (
            <Img
              src={image2}
              alt={name2 || undefined}
              className={classNames(
                'flex-1 h-20 object-contain overflow-hidden ml-[17px] p-4',
              )}
            />
          )}
        </div>

        <div className="relative flex w-full bg-white">
          <Banner product={product1} className="flex-1 mr-[17px]" />
          <Banner product={product2} className="flex-1 ml-[17px]" />

          <div className="absolute left-0 right-0 bottom-0 flex items-end justify-center">
            <div className="text-[#ececec] font-semibold px-2 text-lg rounded-t bg-main-brand border-0.5 border-b-0 border-gray-50">
              VS
            </div>
          </div>
        </div>

        <div className="flex flex-col text-base text-content p-4">
          <h3 className="font-medium text-lg text-link">
            {name1} vs {name2}
          </h3>
          <Subtitle productType={productType} tag={tag} />
        </div>
      </Card>
    </a>
  );
}

interface BannerProps {
  product: Partial<Product>;
  className?: string;
  loading?: boolean;
}

const Banner: FunctionComponent<BannerProps> = (props) => {
  const { product, className, loading } = props;
  const company = useMemo(() => product.company?.toLowerCase(), [product]);

  return (
    <div
      className={classNames(
        'flex-1 text-light-shades font-semibold text-base bg-main-brand',
        'border-t-px border-r-px border-gray-50 text-center',
        'relative w-full h-6',
        'flex items-center justify-center',
        company === 'nvidia' ? 'bg-nvidia' : '',
        company === 'amd' ? 'bg-amd' : '',
        company === 'intel' ? 'bg-intel' : '',
        className,
      )}
    >
      {loading && <Skeleton className="w-[50%]" pulse />}
      {!loading && (
        <span className="sm:hidden absolute left-0 right-0 top-0 bottom-0 text-ellipsis overflow-hidden whitespace-nowrap px-4">
          {formatProductName(product)}
        </span>
      )}
      {!loading && (
        <span className="hidden sm:inline-block absolute left-0 right-0 top-0 bottom-0 text-ellipsis overflow-hidden whitespace-nowrap px-4">
          {formatProductName(product, { company: false })}
        </span>
      )}
    </div>
  );
};

interface SubtitleProps {
  productType: ProductType;
  tag?: ProductComparisonCardTag;
}

function Subtitle(props: SubtitleProps) {
  const { productType, tag } = props;

  const tags = tag != null ? [productType, tag] : [productType];

  return (
    <ContentProvider tags={tags}>
      <CardSubtitle />
    </ContentProvider>
  );
}

interface LoadingComparisonCardProps {
  productType: ProductType;
}

function LoadingComparisonCard(props: LoadingComparisonCardProps) {
  const [company1, company2] = useMemo(() => {
    if (props.productType === ProductType.Cpu) {
      return ['intel', 'amd'];
    } else if (props.productType === ProductType.Gpu) {
      return ['nvidia', 'amd'];
    }
    return [null, null];
  }, [props.productType]);

  return (
    <Card as="article" className="gap-0 p-0 mx-4 mb-6 min-w-70">
      <div className="bg-white flex rounded-t rounded-b-none overflow-hidden border-b-px py-4">
        <div className="flex-1 flex justify-center">
          <Skeleton pulse className="w-14 h-14 rounded-full mr-[17px]" />
        </div>
        <div className="flex-1 flex justify-center">
          <Skeleton pulse className="w-14 h-14 rounded-full ml-[17px]" />
        </div>
      </div>

      <div className="relative flex w-full bg-white">
        <Banner
          product={{ company: company1 }}
          className="flex-1 mr-[17px]"
          loading
        />
        <Banner
          product={{ company: company2 }}
          className="flex-1 ml-[17px]"
          loading
        />

        <div className="absolute left-0 right-0 bottom-0 flex items-end justify-center">
          <div className="text-[#ececec] font-semibold px-2 text-lg rounded-t bg-main-brand border-0.5 border-b-0 border-gray-50">
            VS
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4">
        <Skeleton pulse className="w-[100%]" />

        <div className="flex flex-col gap-2">
          <Skeleton pulse className="w-[100%]" />
          <Skeleton pulse className="w-[100%]" />
        </div>
      </div>
    </Card>
  );
}
