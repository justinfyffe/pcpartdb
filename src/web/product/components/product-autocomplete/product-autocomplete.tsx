import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { Product, ProductType } from '../../../../types/product';
import { ProductCache } from '../../../shared/cache';
import {
  Autocomplete,
  AutocompleteOption,
} from '../../../shared/components/autocomplete';
import { Img } from '../../../shared/components/image';
import { productService } from '../../product.service';

interface ProductAutocompleteProps {
  productType: ProductType;

  value?: number;
  onChange?: (value: number) => void;

  excludeProductId?: number;

  className?: string;
}

export const ProductAutocomplete = forwardRef<
  HTMLInputElement,
  ProductAutocompleteProps
>((props, ref) => {
  const {
    value,
    productType: type,
    onChange,
    excludeProductId,
    className,
  } = props;

  const [results, setResults] = useState<Product[]>([]);
  const [product, setProduct] = useState(() => {
    if (value == null) {
      return null;
    }

    return ProductCache.get(value);
  });

  useEffect(() => {
    async function fetchProduct() {
      if (product != null && value != null) {
        return;
      }

      const result =
        ProductCache.get(value) || (await productService.get(value));
      setProduct(result);
    }

    if (value != null) {
      fetchProduct();
    }
  }, [product, value]);

  const handleQuery = useCallback(
    async (query: string) => {
      const results = await productService.autocompleteProduct(query, type);
      const filtered = results.filter(
        (product) => product != null && product.id !== excludeProductId,
      );

      setResults(filtered);

      return filtered.length > 0;
    },
    [type, excludeProductId, setResults],
  );

  const handleChange = useCallback(
    async (value: string) => {
      if (value == null) {
        setProduct(null);
        onChange?.(null);
        return;
      }

      const productId = Number(value);
      const selectedProduct =
        ProductCache.get(productId) || (await productService.get(productId));
      setProduct(selectedProduct);
      onChange?.(productId);
    },
    [onChange],
  );

  return (
    <Autocomplete
      prefix={
        product ? (
          <Img src="/images/logos/nvidia.svg" className="h-5" />
        ) : undefined
      }
      label={product?.name ?? ''}
      value={value != null && value !== 0 ? `${value}` : ''}
      onQuery={handleQuery}
      onChange={handleChange}
      className={className}
      ref={ref}
    >
      {results.map((result) => (
        <AutocompleteOption
          key={result.id}
          label={result.name}
          value={`${result.id}`}
          className="hover:bg-[#fafafa]"
          hoveredClassName="bg-[#fafafa]"
        >
          <Img src="/images/logos/nvidia.svg" className="h-5" />
          <span className="ml-2">{result.name}</span>
        </AutocompleteOption>
      ))}
    </Autocomplete>
  );
});
ProductAutocomplete.displayName = 'ProductAutocomplete';
