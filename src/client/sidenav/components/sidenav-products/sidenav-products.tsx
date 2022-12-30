import { getProductName, getViewGpuSlug } from '@client/product';
import { classNames } from '@client/shared/ui';
import { getViewGpuPath } from '@client/shared/website';
import { Product } from '@shared/product';
import React, { FunctionComponent } from 'react';
import { SidenavSection, SidenavSectionTitle } from '../sidenav';

interface SidenavProductsProps {
  products?: Product[];
  className?: string;
}

export const SidenavProducts: FunctionComponent<SidenavProductsProps> = (
  props,
) => {
  const products = props.products || [];

  return (
    <SidenavSection
      className={classNames('flex flex-col gap-3', props.className)}
    >
      <SidenavSectionTitle>Related GPUs</SidenavSectionTitle>

      <div className="flex flex-col gap-4">
        {products.map((product) => (
          <ProductListing key={product.id} product={product} />
        ))}
      </div>
    </SidenavSection>
  );
};

interface ProductListingProps {
  product: Product;
}

const ProductListing: FunctionComponent<ProductListingProps> = (props) => {
  const { product } = props;

  return (
    <a
      href={getViewGpuPath(getViewGpuSlug(product))}
      className="flex items-center gap-3 px-3 py-3 border-px rounded text-sm"
    >
      <div className="flex-1">{getProductName(product)}</div>
    </a>
  );
};
