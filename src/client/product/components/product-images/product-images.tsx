import { getImageUrl } from '@client/image';
import { Img } from '@client/shared/components';
import { classNames } from '@client/shared/ui';
import { Product } from '@shared/product';
import { getCompanyLogoImage } from '@shared/product-image';
import React, { FunctionComponent, useMemo, useState } from 'react';
import { ProductImageOption } from './product-image-option';

interface ProductImagesProps {
  product: Product;

  className?: string;
}

export const ProductImages: FunctionComponent<ProductImagesProps> = (props) => {
  const { product, className } = props;

  const [selected, setSelected] = useState(0);

  const images = useMemo(() => {
    const productImages = product.images?.details ?? [];
    const companyImage = getCompanyLogoImage(product);
    const images = productImages
      .filter((image) => image.image != null)
      .map((image) => getImageUrl(image.image));

    if (companyImage != null) {
      images.push(companyImage);
    }

    return images;
  }, [product]);

  if (images.length === 0) {
    return <></>;
  }

  return (
    <div
      className={classNames(
        'flex flex-wrap gap-3 mx-auto items-center justify-start w-full',
        className,
      )}
    >
      <div className="aspect-square bg-slate-50 flex items-center justify-center rounded w-full">
        <Img className="h-auto mx-auto w-full" src={images[selected]} />
      </div>

      <div className="flex flex-wrap w-full gap-4">
        {images.map((image, i) => (
          <ProductImageOption
            key={i}
            src={image}
            onClick={() => setSelected(i)}
            className={selected === i ? 'border-px border-black' : ''}
          />
        ))}
      </div>
    </div>
  );
};
