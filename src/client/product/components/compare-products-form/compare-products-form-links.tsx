import {
  getProductComparisonName,
  getProductComparisonPath,
  getProductDetailsPath,
  getProductName,
  RelevantProducts,
} from '@shared/product';
import React, { FunctionComponent } from 'react';

interface CompareProductsFormLinksProps {
  relevantProducts: RelevantProducts;
}

export const CompareProductsFormLinks: FunctionComponent<
  CompareProductsFormLinksProps
> = (props) => {
  const { relevantProducts } = props;
  const { comparisons, gpus } = relevantProducts;

  return (
    <section className="flex flex-col gap-1 text-xs">
      <div className="flex gap-2">
        Popular Comparisons:
        <ul className="flex gap-3">
          {comparisons.map((comparison, i) => (
            <li key={i}>
              <a href={getProductComparisonPath(...comparison)}>
                {getProductComparisonName(comparison)}
              </a>
              {i === comparisons.length - 1 && <>,</>}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex gap-2">
        Popular GPUs:
        <ul className="flex gap-3">
          {gpus.map((gpu, i) => (
            <li key={i}>
              <a href={getProductName(gpu)}>{getProductDetailsPath(gpu)}</a>
              {i === gpus.length - 1 && <>,</>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
