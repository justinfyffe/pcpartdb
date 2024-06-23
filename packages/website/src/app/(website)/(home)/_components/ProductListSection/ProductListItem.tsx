'use client';

import {
  formatProductName,
  getViewProductPath,
  Product,
  productBenchmarkValue,
  productBenchmarkValuePerMsrp,
  productFieldFormattedValue,
  ProductType,
} from '@pcpartdb/shared';
import { Img } from 'packages/website/src/app/_common/components/Img/Img';
import { Skeleton } from 'packages/website/src/app/_common/components/Skeleton/Skeleton';
import { usePreferredBenchmark } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmark';
import { classNames } from 'packages/website/src/app/_common/utils/classNames';
import { companyLogoFeedPath } from 'packages/website/src/app/_common/utils/companyLogoFeedPath';
import React, { useMemo } from 'react';
import { ListType, usePageContext } from '../../PageProvider';

interface ProductListItemProps {
  productType: ProductType;
  product: Product;
  rank?: number;
  loading?: boolean;
}

export function ProductListItem(props: ProductListItemProps) {
  const { productType, product, rank, loading } = props;
  const { cpuListType, gpuListType } = usePageContext();
  const benchmark = usePreferredBenchmark(product.productType);

  const url = getViewProductPath({ product });
  const companyImage = companyLogoFeedPath(product);
  const name = useMemo(() => formatProductName(product), [product]);
  const segment = useMemo(
    () => productFieldFormattedValue(product?.fields?.marketSegment),
    [product?.fields?.marketSegment],
  );

  const score = useMemo(() => {
    if (
      (productType === ProductType.Cpu &&
        cpuListType === ListType.Performance) ||
      (productType === ProductType.Gpu && gpuListType === ListType.Performance)
    ) {
      return productBenchmarkValue(product, benchmark);
    } else if (
      (productType === ProductType.Cpu &&
        cpuListType === ListType.PerformancePerMsrp) ||
      (productType === ProductType.Gpu &&
        gpuListType === ListType.PerformancePerMsrp)
    ) {
      return productBenchmarkValuePerMsrp(product, benchmark);
    } else {
      return null;
    }
  }, [benchmark, cpuListType, gpuListType, product, productType]);

  if (loading) {
    return <LoadingListItem />;
  }

  return (
    <div className="rounded border-px flex flex-row gap-4">
      <a
        href={url}
        className="flex-1 flex items-center gap-4 px-4 py-2 sm:px-2 md:px-3"
      >
        {rank != null && (
          <span
            className={classNames(
              'text-lg text-content font-bold px-2',
              rank === 1 ? 'text-[#a46b00]' : '',
              rank === 2 ? 'text-[#707070]' : '',
              rank === 3 ? 'text-[#8b3d00]' : '',
            )}
          >
            {rank}
          </span>
        )}

        <div className="min-w-10 max-w-14">
          <Img src={companyImage} />
        </div>

        <div className="flex-1">
          <span className="font-semibold">{name}</span>
          <div className="text-dimmed text-sm">{segment}</div>
        </div>

        <div className="text-content flex flex-col text-center px-2">
          <span className="text-lg">
            {score?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </span>
        </div>
      </a>
    </div>
  );
}

function LoadingListItem() {
  return (
    <div className="rounded border-px flex flex-row gap-4 items-center gap-4 px-4 py-2 sm:px-2 md:px-3">
      <Skeleton pulse className="w-8" />

      <Skeleton pulse className="rounded-full w-10 h-10" />

      <div className="flex-1 justify-between flex items-center">
        <div className="flex flex-col gap-2">
          <Skeleton pulse className="w-30" />
          <Skeleton pulse className="w-20" />
        </div>
        <Skeleton pulse className="w-8" />
      </div>
    </div>
  );
}
