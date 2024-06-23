import {
  getListCpusPath,
  getListGpusPath,
  ListCpusPresetSlug,
  ListGpusPresetSlug,
  ProductType,
} from '@pcpartdb/shared';
import React from 'react';

interface ProductListLinksProps {
  productType: ProductType;
}

export function ProductListLinks(props: ProductListLinksProps) {
  const { productType } = props;

  return (
    <div className="flex flex-wrap justify-end gap-4 font-medium">
      {productType === ProductType.Cpu && (
        <a href={getListCpusPath(ListCpusPresetSlug.BestPerformance)}>
          Best performance CPUs
        </a>
      )}
      {productType === ProductType.Cpu && (
        <a href={getListCpusPath(ListCpusPresetSlug.BestPerformancePerDollar)}>
          Best performance per dollar CPUs
        </a>
      )}
      {productType === ProductType.Gpu && (
        <a href={getListGpusPath(ListGpusPresetSlug.BestPerformance)}>
          Best performance GPUs
        </a>
      )}
      {productType === ProductType.Gpu && (
        <a href={getListGpusPath(ListGpusPresetSlug.BestPerformancePerDollar)}>
          Best performance per dollar GPUs
        </a>
      )}
    </div>
  );
}
