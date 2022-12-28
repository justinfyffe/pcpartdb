import { classNames } from '@client/shared/ui';
import {
  getProductComparisonName,
  getProductComparisonPath,
  getProductDetailsPath,
  getProductName,
  RelatedProducts,
} from '@shared/product';
import React, { FunctionComponent } from 'react';

interface CompareProductsFormLinksProps {
  relatedProducts: RelatedProducts;
  className?: string;
}

export const CompareProductsFormLinks: FunctionComponent<
  CompareProductsFormLinksProps
> = (props) => {
  const { relatedProducts, className } = props;
  const { comparisons, gpus } = relatedProducts;

  return (
    <section className={classNames('flex flex-col gap-1 text-xs', className)}>
      <div className="flex gap-2">
        Popular Comparisons:
        <ul className="flex gap-3">
          {comparisons.map((comparison, i) => (
            <li key={i}>
              <a href={getProductComparisonPath(comparison)}>
                {getProductComparisonName(comparison)}
              </a>
              {i < comparisons.length - 1 && <>,</>}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex gap-2">
        Popular GPUs:
        <ul className="flex gap-3">
          {gpus.map((gpu, i) => (
            <li key={i}>
              <a href={getProductDetailsPath(gpu)}>{getProductName(gpu)}</a>
              {i < gpus.length - 1 && <>,</>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
