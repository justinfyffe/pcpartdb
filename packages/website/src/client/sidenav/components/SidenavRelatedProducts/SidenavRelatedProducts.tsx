import {
  formatProductName,
  getViewProductPath,
  Product,
  ProductType,
} from '@pcpartdb/shared';
import React, { FunctionComponent, useMemo } from 'react';
import { classNames } from '../../../shared/ui';
import { SidenavSection, SidenavSectionTitle } from '../Sidenav/Sidenav';

interface SidenavRelatedProductsProps {
  productType: ProductType;
  products?: Product[];
  className?: string;
}

export const SidenavRelatedProducts: FunctionComponent<
  SidenavRelatedProductsProps
> = (props) => {
  const { productType } = props;
  const products = props.products || [];

  const title = useMemo(() => {
    if (productType === ProductType.Cpu) {
      return 'Related CPUs';
    } else if (productType === ProductType.Gpu) {
      return 'Related GPUs';
    } else {
      return 'Related Products';
    }
  }, [productType]);

  if (products.length === 0) {
    return <></>;
  }

  return (
    <SidenavSection
      className={classNames('flex flex-col gap-3', props.className)}
    >
      <SidenavSectionTitle>{title}</SidenavSectionTitle>

      <div className="flex flex-col gap-4">
        {products.map((product) => (
          <ProductListing
            key={product.id}
            productType={productType}
            product={product}
          />
        ))}
      </div>
    </SidenavSection>
  );
};

interface ProductListingProps {
  productType: ProductType;
  product: Product;
}

const ProductListing: FunctionComponent<ProductListingProps> = (props) => {
  const { product, productType } = props;

  const name = useMemo(
    () => formatProductName(productType, product),
    [productType, product],
  );
  const href = useMemo(
    () => getViewProductPath(productType, product),
    [productType, product],
  );

  return (
    <a
      href={href}
      className="flex items-center gap-3 px-3 py-3 border-px rounded"
    >
      <div className="flex-1">{name}</div>
    </a>
  );
};
