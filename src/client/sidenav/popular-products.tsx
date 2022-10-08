import { Img } from '@client/shared/components';
import { classNames } from '@client/shared/ui';
import React, { FunctionComponent } from 'react';
import { SidenavSection, SidenavSectionTitle } from './sidenav';

interface SidenavPopularProductsProps {
  className?: string;
}

interface ProductListingProps {}

export const SidenavPopularProducts: FunctionComponent<
  SidenavPopularProductsProps
> = (props) => {
  return (
    <SidenavSection
      className={classNames('flex flex-col gap-3', props.className)}
    >
      <SidenavSectionTitle>Popular GPUs</SidenavSectionTitle>

      <div className="flex flex-col gap-4">
        <ProductListing />
        <ProductListing />
        <ProductListing />
        <ProductListing />
      </div>
    </SidenavSection>
  );
};

const ProductListing: FunctionComponent<ProductListingProps> = () => {
  return (
    <a
      href="#"
      className="flex items-center gap-3 px-2 py-3 border rounded text-sm"
    >
      <Img
        className="max-h-[60px] max-w-[60px] mx-auto"
        src="https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ampere/rtx-3090/geforce-rtx-3090-shop-630-d@2x.png"
      />

      <div className="flex-1">NVIDIA GeForce RTX 3080</div>
    </a>
  );
};
