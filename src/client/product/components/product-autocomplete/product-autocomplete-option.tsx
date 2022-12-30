import { getCompanyLogoImagePath } from '@client/image';
import { formatSpec } from '@client/product';
import { getGpuName } from '@client/product/product-utils';
import { AutocompleteOption, Img } from '@client/shared/components';
import { DateFormatter } from '@client/shared/format';
import { Product } from '@shared/product';
import React, { FunctionComponent } from 'react';

interface ProductAutocompleteOptionProps {
  index: number;
  product: Product;
}

export const ProductAutocompleteOption: FunctionComponent<
  ProductAutocompleteOptionProps
> = (props) => {
  const { index, product } = props;

  const id = product.id;
  const name = getGpuName(product, { company: false });
  const image = getCompanyLogoImagePath(product);

  const releaseDate = formatSpec(product.specs?.releaseDate, {
    dateFormatter: DateFormatter.Year,
  });
  const price = formatSpec(product.specs?.launchPrice);

  return (
    <AutocompleteOption index={index} label={name} value={`${id}`}>
      <div className="flex flex-1 items-center gap-4">
        {image != null ? <Img src={image} className="h-5" /> : <></>}
        <span className="flex-1 text-sm">{getGpuName(product)}</span>
        <div className="flex flex-col gap-1 items-end text-2xs">
          <div className="text-[#aaa]">{releaseDate}</div>
          <div className="text-[#aaa]">{price}</div>
        </div>
      </div>
    </AutocompleteOption>
  );
};
