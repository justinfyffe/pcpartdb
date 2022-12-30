import { getCompanyLogoImagePath, getImagePath } from '@client/image';
import { Img } from '@client/shared/components';
import { classNames } from '@client/shared/ui';
import { Product } from '@shared/product';
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
    const companyImage = getCompanyLogoImagePath(product);
    const images = productImages
      .filter((image) => image.image != null)
      .map((image) => getImagePath(image.image));

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
        'flex flex-col gap-3 mx-auto items-start justify-start w-full',
        className,
      )}
    >
      <div className="bg-slate-50 flex items-center justify-center rounded w-full h-70 p-4">
        <Img
          className="mx-auto h-auto max-h-full w-auto"
          src={images[selected]}
        />
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
